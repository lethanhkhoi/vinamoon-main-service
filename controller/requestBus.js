const requestBusCol = require("../dataModel/requestBusCol");
const pickingAddress = require("./pickingAddress.js");
const pickingAddressCol = require("../dataModel/pickingAddressCol.js");
const ObjectID = require("mongodb").ObjectId;
const { phoneFormat } = require("../utils/formatter");
const { requestStatus, device } = require("../config/constant");
const { ErrorHandler } = require("../middlewares/errorHandler");
const {
  WebRequest,
  MobileRequest,
  MobileRequestNearest,
  RequestProcessorStrategy,
} = require("./RequestProcessorStrategy");
const SMS = require("../utils/sms");

const constructAddressFromWeb = (obj) => {
  const id = new ObjectID();
  return {
    homeNo: obj.homeNo,
    street: obj.street,
    district: obj.district,
    ward: obj.ward,
    city: obj.city,
    _id: id,
    id: id.toString(),
  };
};

const constructRequestFromWeb = (obj) => {
  const id = new ObjectID();
  return {
    phone: obj.phone,
    name: obj.name,
    vehicleId: obj.vehicleId,
    date: new Date(),
    status: requestStatus.NEW,
    device: obj.device || device.WEB,
    _id: id,
    id: id.toString(),
  };
};

async function getAll(req, res, next) {
  try {
    let data = await requestBusCol.getAll();
    const result = data[0].data.map((item) => ({
      ...item,
      pickingLocation: item.pickingLocation[0],
      vehicleType: item.vehicleType[0],
    }));
    return res.json({ errorCode: null, data: result });
  } catch (error) {
    next(error);
  }
}

async function createFromWeb(req, res, next) {
  try {
    const data = req.body;
    const user = req.body.phone ?? req.user.phone;

    const address = constructAddressFromWeb(data);
    const request = constructRequestFromWeb(data);

    const pickingAddressResult = await pickingAddress.create(address, user);
    if (!pickingAddressResult) {
      new ErrorHandler(204, "Cannot create picking address");
    }
    request.pickingAddress = pickingAddressResult.id;
    const result = await requestBusCol.create(request);
    if (!result) {
      new ErrorHandler(204, "Cannot create request");
    }
    return res.json({ errorCode: null, data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getOne(req, res, next) {
  try {
    const code = req.params.code;
    let result = await requestBusCol.getOne(code);
    if (!result) {
      new ErrorHandler(204, "Cannot find request");
    }
    result.pickingLocation = result.pickingLocation[0];
    result.vehicleType = result.vehicleType[0];
    return res.json({ errorCode: null, data: result });
  } catch (err) {
    next(err);
  }
}
async function getOneByUser(req, res, next) {
  try {
    const phone = req.params.code;
    let result = await requestBusCol.getOneByPhone(phone);
    if (!result) {
      new ErrorHandler(204, "Cannot find request");
    }
    result.map((item) => {
      item.pickingLocation = item.pickingLocation[0];
      item.vehicleType = item.vehicleType[0];
    });
    return res.json({ errorCode: null, data: result });
  } catch (err) {
    next(err);
  }
}

async function processWithNearest(data, nearest, phone, processor) {
  let exist = false;
  const requests = nearest.requests.map((item) => {
    if (item.phone === phone) {
      exist = true;
      return { ...item, count: item.count + 1 };
    }
    return item;
  });

  if (!exist) {
    requests.push({ phone, count: 1 });
  }

  await pickingAddressCol.update(nearest.id, {
    ...nearest,
    requests,
  });

  if (nearest.distance > 0) {
    if (data.device === device.WEB) {
      await pickingAddressCol.removeOneByCode(data.pickingAddressId);
      await requestBusCol.findOneAndUpdate(data.requestBusId, {
        pickingAddress: nearest.id,
      });
    } else {
      data.pickingAddressId = nearest.id;
      processor.setStrategy(new MobileRequestNearest());
      return (await processor.create(data));
    }
  }

  const result = await requestBusCol.findOneAndUpdate(data.requestBusId, {
    status: requestStatus.PENDING,
  });

  return result;
}

async function create(req, res, next) {
  try {
    let data = req.body;

    if (!data.origin) {
      new ErrorHandler(204, "Missing origin");
    }

    const phone = data.phone;
    const smsPhone = phoneFormat(phone);
    if (!smsPhone) {
      new ErrorHandler(204, "Invalid phone number");
    }

    const processor = new RequestProcessorStrategy();

    if (data.device === device.WEB) {
      processor.setStrategy(new WebRequest());
    } else if (data.device === device.MOBILE) {
      processor.setStrategy(new MobileRequest());
    }

    const location = data.origin;
    let nearest = await pickingAddressCol.getNearest(location);

    if (nearest.length > 0) {
      nearest = nearest[0];
      const result = await processWithNearest(data, nearest, phone, processor);

      await SMS.confirmBooking(smsPhone, result.id);
      return res.json({ errorCode: null, result: result });
    } else {
      const result = processor.create(data);

      await SMS.confirmBooking(smsPhone, result.id);
      return res.json({ errorCode: null, result: result });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  createFromWeb,
  getOne,
  create,
  getOneByUser,
};
