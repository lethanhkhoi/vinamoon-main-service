const database = require("../utils/database");
const ObjectID = require("mongodb").ObjectId;
const vehicleProperties = ["seat", "unitPrice"];
const creatValidation = ["unitPrice", "seat"];
async function getAll() {
  return await database.vehicleModel().find().toArray();
}
async function create(data) {
  data["createdAt"] = new Date();
  return await database.vehicleModel().insertOne(data).ops[0];
}

async function update(code, data) {
  data["updateAt"] = new Date();
  const result = await database.vehicleModel().findOneAndUpdate(
    { id: code },
    {
      $set: data,
    }
  );
  return result.value;
}
module.exports = {
  getAll,
  create,
  update,
  vehicleProperties,
  creatValidation,
};
