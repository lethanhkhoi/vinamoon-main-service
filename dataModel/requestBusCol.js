const { dataPagination } = require("../helperFunction/helper");
const database = require("../utils/database");
const { requestStatus } = require("../config/constant");
const vehicleCol = require("../dataModel/vehicleCol");
const directions = require("../utils/directions");

const validateRequest = ["homeNo", "street", "district", "city", "vehicleId"];
const validateRequestWithLocation = [
  "homeNo",
  "street",
  "district",
  "city",
  "vehicleId",
  "origin",
];

function joinAddress(aggregate = []) {
  aggregate.push({
    $lookup: {
      from: "picking_address",
      localField: "pickingAddress",
      foreignField: "id",
      as: "pickingLocation",
    },
  });
  aggregate.push({
    $lookup: {
      from: "vehicle_type",
      localField: "vehicleId",
      foreignField: "id",
      as: "vehicleType",
    },
  });
  aggregate.push({
    $unwind: { path: "$request", preserveNullAndEmptyArrays: true },
  });
  return aggregate;
}

function joinAddressGetWeb(aggregate = []) {
  aggregate.push({
    $match: {
      device: { $eq: "web" },
    },
  });
  aggregate.push({
    $lookup: {
      from: "picking_address",
      localField: "pickingAddress",
      foreignField: "id",
      as: "pickingLocation",
    },
  });
  aggregate.push({
    $lookup: {
      from: "vehicle_type",
      localField: "vehicleId",
      foreignField: "id",
      as: "vehicleType",
    },
  });
  aggregate.push({
    $unwind: { path: "$request", preserveNullAndEmptyArrays: true },
  });
  return aggregate;
}

async function getAll() {
  try {
    let pipeline = null;
    const sortBy = {
      createdAt: -1,
    };
    pipeline = dataPagination({}, sortBy, 1, 1000, joinAddressGetWeb());
    const result = await database.requestModel().aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    return null;
  }
}
async function getAllDone() {
  try {
    const result = await database
      .requestModel()
      .find({
        status: requestStatus.DONE,
      })
      .toArray();
    return result;
  } catch (error) {
    return null;
  }
}
async function create(data) {
  try {
    data["createdAt"] = new Date();
    const result = await database.requestModel().insertOne(data);
    return result;
  } catch (error) {
    return null;
  }
}
async function getPrice(vehicleId, start, end) {
  const vehicle = await vehicleCol.getOne(vehicleId);
  const distance = await directions.getDistance(start, end);

  if (!distance) {
    new ErrorHandler(204, "Cannot get distance");
  }

  return Math.round((distance * vehicle?.unitPrice) / 1000) || 0;
}

async function getOne(code) {
  try {
    const result = await database
      .requestModel()
      .aggregate([
        ...joinAddress(),
        {
          $match: { id: code },
        },
      ])
      .toArray();
    return result[0];
  } catch (error) {
    return null;
  }
}

async function getOneByPhone(phone) {
  try {
    const result = await database
      .requestModel()
      .aggregate([
        ...joinAddress(),
        {
          $match: { phone: phone },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    return null;
  }
}
async function findOneAndUpdate(code, query) {
  try {
    const result = await database.requestModel().findOneAndUpdate(
      { id: code },
      {
        $set: query,
      }
    );
    return result;
  } catch (error) {
    return null;
  }
}

async function deleteMany(data) {
  try {
    const result = await database.requestModel().deleteMany(data);
    return result;
  } catch (error) {
    throw error;
  }
}

async function update(code, data) {
  try {
    const result = await database.requestModel().findOneAndUpdate({id: code}, {$set: data});
    return result.value;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAll,
  create,
  getOne,
  validateRequest,
  validateRequestWithLocation,
  findOneAndUpdate,
  getOneByPhone,
  getAllDone,
  getPrice,
  deleteMany,
  update
};
