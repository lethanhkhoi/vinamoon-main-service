const { dataPagination } = require("../helperFunction/helper");
const database = require("../utils/database");

const validateRequest = ["name", "vehicleId"];
function joinAdress(aggregate = []) {
  aggregate.push({
    $lookup: {
      from: "picking_address",
      localField: "pickingAddress",
      foreignField: "id",
      as: "pickingLocation",
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
    pipeline = dataPagination({}, sortBy, 1, 1000, joinAdress());
    return await database.requestModel().aggregate(pipeline).toArray();
  } catch (error) {
    return null;
  }
}
async function create(data) {
  try {
    data["createdAt"] = new Date()
    const result = await database.requestModel().insertOne(data);
    return result.ops[0];
  } catch (error) {
    return null;
  }
}

async function getOne(code) {
  try {
    const result = await database
      .requestModel()
      .aggregate([
        ...joinAdress(),
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

module.exports = {
  getAll,
  create,
  getOne,
  validateRequest,
};
