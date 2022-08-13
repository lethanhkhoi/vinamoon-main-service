const requestBusCol = require("../dataModel/requestBusCol");
const pickingAddress = require("./pickingAddress.js");
const pickingAddressCol = require("../dataModel/pickingAddressCol.js");
const { getDistance } = require("../utils/getDistance");
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
      data.pickingAddress,
      user,
      data.pickingAddress.pickingId
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
    const location = await pickingAddressCol.getAll();
    const user = req.user;
    for (property in requestBusCol.validateRequest) {
      if (data[property] === null) {
        return res.status(200).send({
          errorCode: true,
          exitCode: 1,
          data: "Missing property",
        });
      }
    }
    if (!req.body.origin || !req.body.destination) {
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
      return res.json({ errorCode: true, data: "system error" });
    }
    if (req.body.device === "mobile") {
      const data = {
        id: ObjectID().toString(),
        phone: user.phone,
        name: req.body.name ?? req.user.name,
        vehicleId: req.body.vehicleId,
        pickingAddress: pickingLocation.id,
        status: "Pending",
        destination: {
          lat: req.body.destination.lat,
          long: req.body.destination.long,
        },
      };
      const create = await requestBusCol.create(data);
      if (!create) {
        return res.json({
          errorCode: true,
          data: "Cannot create booking request",
        });
      }
      return res.json({ errorCode: null, data: create });
    }
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
