const { dataPagination } = require("../helperFunction/helper");
const database = require("../utils/database");

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
async function getAll() {
  try {
    let pipeline = null;
    const sortBy = {
      createdAt: -1,
    };
    pipeline = dataPagination({}, sortBy, 1, 1000, joinAddress());
    const result = await database.requestModel().aggregate(pipeline).toArray();
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

module.exports = {
  getAll,
  create,
  getOne,
  validateRequest,
  validateRequestWithLocation,
  findOneAndUpdate,
};
