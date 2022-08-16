const requestBusCol = require("../dataModel/requestBusCol");
const pickingAddress = require("./pickingAddress.js");
const pickingAddressCol = require("../dataModel/pickingAddressCol.js");
const { getDistance } = require("../utils/getDistance");
const { getAddress } = require("../utils/googleAPI");
const { add } = require("winston");
const ObjectID = require("mongodb").ObjectId;

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
    for (property in requestBusCol.validateRequest) {
      if (data[property] === null) {
        return res.status(200).send({
          errorCode: true,
          exitCode: 1,
          data: "Missing property",
        });
      }
    }
    data.date = new Date();
    data.status = "Pending";
    data.id = ObjectID().toString();
    const pickingAddressResult = await pickingAddress.create(
      data,
      user,
    );
    if (!pickingAddressResult) {
      return res.status(200).send({
        errorCode: true,
        exitCode: 1,
        data: "Cannot create picking address",
      });
    }
    data.pickingAddress = pickingAddressResult.id;
    const result = await requestBusCol.create(data);
    if (!result) {
      return res.status(200).send({
        errorCode: true,
        exitCode: 1,
        data: "Cannot create request",
      });
    }
    return res.json({ errorCode: null, data: data });
  } catch (error) {
    next(error);
  }
}
async function getOne(req, res, next) {
  try {
    const code = req.params.code;
    let result = await requestBusCol.getOne(code);
    if (!result) {
      return res.status(200).send({
        errorCode: true,
        exitCode: 1,
        data: "Cannot find request",
      });
    }
    result.pickingLocation = result.pickingLocation[0];
    result.vehicleType = result.vehicleType[0];
    return res.json({ errorCode: null, data: result });
  } catch (err) {
    next(err);
  }
}
async function create(req, res) {
  try {
    const data = req.body;
    const location = await pickingAddressCol.getAll();
    const user = req.user;
    for (property of requestBusCol.validateRequest) {
      if (data[property] === null) {
        return res.json({
          errorCode: true,
          data: `Missing property ${property}`,
        });
      }
    }
    if (!req.body.origin) {
      return res.json({ errorCode: true, data: "Please input long and lat" });
    }
    const newLocationArray = location.filter((item) => item.long && item.lat);
    let distanceArray = [];
    newLocationArray.map((item, index) => {
      const distance = getDistance(
        { lat1: item.lat, lon1: item.long },
        { lat2: req.body.origin.lat, lon2: req.body.origin.long }
      );
      distanceArray.push(distance);
    });
    const min = Math.min(...distanceArray);
    const minIndex = distanceArray.indexOf(min);
    let pickingLocation = newLocationArray[minIndex];
    if (min > 0.003) {
      if (req.body.device === "mobile") {
        const address = await getAddress(
          req.body.origin.lat,
          req.body.origin.long
        );
        pickingLocation = {
          id: ObjectID().toString(),
          homeNo: address[0].long_name,
          street: address[1].long_name,
          district: address[2].long_name,
          ward: "",
          city: address[3].long_name,
          lat: req.body.origin.lat,
          long: req.body.origin.long,
          requests: [
            {
              phone: user.phone,
              count: 1,
            },
          ],
        };
        const create = await pickingAddressCol.create(pickingLocation);
        if (!create) {
          return res.json({
            errorCode: true,
            data: "Cannot create new picking address",
          });
        }
      } else if (req.body.device === "web"){
        pickingLocation = await pickingAddressCol.getOneByCode(req.body.pickingAddressId)
        pickingLocation.lat = req.body.origin.lat
        pickingLocation.long = req.body.origin.long
        const resultUpdate = await pickingAddressCol.update(req.body.pickingAddressId, pickingLocation)
        if (!resultUpdate) {
          return res.json({
            errorCode: true,
            data: "Update picking address fail",
          });
        }
        const tempUpdate = await requestBusCol.update(req.body.requestBusId, {pickingAddress: req.body.pickingAddressId})
        if(tempUpdate){
          return res.json({errorCode: null, data: tempUpdate})
        }
      }
    } else {
      pickingLocation.requests.map((item) => {
        if (item.phone === user.phone) {
          pickingLocation.requests.map((item) => {
            if (item.phone === user.phone) {
              item.count++;
            }
          });
        }
      });
      const updated = await pickingAddressCol.update(
        pickingLocation.id,
        pickingLocation
      );
      if (!updated) {
        return res.json({
          errorCode: true,
          data: "Cannot update picking address",
        });
      }
    }
    const requestBustData = {
      id: ObjectID().toString(),
      phone: user.phone,
      name: req.body.name ?? req.user.name,
      vehicleId: req.body.vehicleId,
      pickingAddress: pickingLocation.id,
      status: "Pending",
      destination: {
        lat: req.body.destination.lat ?? null,
        long: req.body.destination.long ?? null,
      },
    };

    const create = await requestBusCol.create(requestBustData);
    if (!create) {
      return res.json({
        errorCode: true,
        data: "Cannot create booking request",
      });
    }
    return res.json({ errorCode: null, data: requestBustData });
  } catch (error) {
    return res.json({ errorCode: true, data: "System error" });
  }
}
module.exports = {
  getAll,
  createFromWeb,
  getOne,
  create,
};
