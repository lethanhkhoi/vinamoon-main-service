const requestBusCol = require("../dataModel/requestBusCol");
const pickingAddress = require("./pickingAddress.js");
const pickingAddressCol = require("../dataModel/pickingAddressCol.js");
const { getAddress } = require("../utils/googleAPI");
const ObjectID = require("mongodb").ObjectId;
const { requestStatus, device } = require("../config/constant");
const { ErrorHandler } = require("../middlewares/errorHandler");
const {
  RequestProcessor,
  WebRequest,
  MobileRequest,
} = require("../controller/RequestProcessor");

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

async function processWithNearest(data, nearest, phone) {
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

  if (nearest.distance > 0 && data.device === device.WEB) {
    await pickingAddressCol.removeOneByCode(data.pickingAddressId);
    await requestBusCol.findOneAndUpdate(data.requestBusId, {
      pickingAddress: nearest.id,
    });
  }

  const result = await requestBusCol.findOneAndUpdate(data.requestBusId, {
    status: requestStatus.PENDING,
  });

  return result;
}

async function create(req, res) {
  try {
    let data = req.body;
    if (!data.origin) {
      new ErrorHandler(204, "Missing origin");
    }

    const processor = new RequestProcessor();
    if (data.device === device.WEB) {
      processor.setStrategy(new WebRequest());
    } else if (data.device === device.MOBILE) {
      processor.setStrategy(new MobileRequest());
    }

    const location = data.origin;
    let nearest = await pickingAddressCol.getNearest(location);

    if (nearest.length > 0) {
      nearest = nearest[0];
      const phone = processor.getPhone(req);

      const result = await processWithNearest(data, nearest, phone);
      return res.json({ errorCode: null, result: result });
    } else {
      // console.log("create new");
      processor.create(data);
    }

    // const min = Math.min(...distanceArray);
    // const minIndex = distanceArray.indexOf(min);
    // let pickingLocation = newLocationArray[minIndex];

    // if (min > 0.003) {
    //   if (req.body.device === device.MOBILE) {
    //     const address = await getAddress(
    //       req.body.origin.lat,
    //       req.body.origin.long
    //     );
    //     pickingLocation = {
    //       id: ObjectID().toString(),
    //       homeNo: address[0].long_name,
    //       street: address[1].long_name,
    //       district: address[2].long_name,
    //       ward: "",
    //       city: address[3].long_name,
    //       lat: req.body.origin.lat,
    //       long: req.body.origin.long,
    //       requests: [
    //         {
    //           phone: user.phone,
    //           count: 1,
    //         },
    //       ],
    //     };

    //     const create = await pickingAddressCol.create(pickingLocation);
    //     if (!create) {
    //       return res.json({
    //         errorCode: true,
    //         data: "Cannot create new picking address",
    //       });
    //     }
    //   } else if (req.body.device === device.WEB) {
    //     pickingLocation = await pickingAddressCol.getOneByCode(
    //       req.body.pickingAddressId
    //     );
    //     pickingLocation.lat = req.body.origin.lat;
    //     pickingLocation.long = req.body.origin.long;
    //     const resultUpdate = await pickingAddressCol.update(
    //       req.body.pickingAddressId,
    //       pickingLocation
    //     );

    //     if (!resultUpdate) {
    //       return res.json({
    //         errorCode: true,
    //         data: "Update picking address fail",
    //       });
    //     }

    //     const tempUpdate = await requestBusCol.update(req.body.requestBusId, {
    //       pickingAddress: req.body.pickingAddressId,
    //     });

    //     if (tempUpdate) {
    //       return res.json({ errorCode: null, data: tempUpdate });
    //     }
    //   }
    // } else {
    //   pickingLocation.requests.map((item) => {
    //     if (item.phone === user.phone) {
    //       pickingLocation.requests.map((item) => {
    //         if (item.phone === user.phone) {
    //           item.count++;
    //         }
    //       });
    //     }
    //   });

    //   const updated = await pickingAddressCol.update(
    //     pickingLocation.id,
    //     pickingLocation
    //   );

    //   if (!updated) {
    //     return res.json({
    //       errorCode: true,
    //       data: "Cannot update picking address",
    //     });
    //   }
    // }

    // const requestBusData = {
    //   id: ObjectID().toString(),
    //   phone: user.phone,
    //   name: req.body.name ?? req.user.name,
    //   vehicleId: req.body.vehicleId,
    //   pickingAddress: pickingLocation.id,
    //   status: requestStatus.PENDING,
    //   destination: {
    //     lat: req.body.destination?.lat ?? null,
    //     long: req.body.destination?.long ?? null,
    //   },
    // };

    // const create = await requestBusCol.create(requestBusData);
    // if (!create) {
    //   return res.json({
    //     errorCode: true,
    //     data: "Cannot create booking request",
    //   });
    // }
    // return res.json({ errorCode: null, data: requestBusData });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  createFromWeb,
  getOne,
  create,
};
