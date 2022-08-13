const database = require("../utils/database");
const vehicleProperties = ["name", "seat", "unitPrice"];
const creatValidation = ["name", "unitPrice", "seat"];
async function getAll() {
  return await database.vehicleModel().find().toArray();
}
async function create(data) {
  data["createdAt"] = new Date();
  return await database.vehicleModel().insertOne(data);
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
