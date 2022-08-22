const database = require("../utils/database");
const vehicleProperties = ["name", "seat", "unitPrice"];
const creatValidation = ["name", "unitPrice", "seat"];
async function getAll() {
  return await database.vehicleModel().find().toArray();
}
async function create(data) {
  try {
    data["createdAt"] = new Date();
    return await database.vehicleModel().insertOne(data).ops[0];
  } catch (error) {
    throw new ErrorHandler(204, "Cannot create vehicle");
  }
}

async function update(code, data) {
  try {
    data["updateAt"] = new Date();
    const result = await database.vehicleModel().findOneAndUpdate(
      { id: code },
      {
        $set: data,
      }
    );
    return result.value;
  } catch (error) {
    throw new ErrorHandler(204, "Cannot update vehicle");
  }
}

async function getOne(id) {
  try {
    const result = await database.vehicleModel().findOne({ id });
    return result;
  } catch (error) {
    throw new ErrorHandler(204, "Cannot find vehicle");
  }
}
module.exports = {
  getAll,
  create,
  update,
  getOne,
  vehicleProperties,
  creatValidation,
};
