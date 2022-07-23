const database = require("../utils/database");
async function getOneByCode(code) {
  try {
    const result = await database.pickingAddressModel().findOne({ id: code });
    return result;
  } catch (error) {
    return null;
  }
}

async function create(data) {
  try {
    data["createdAt"] = new Date();
    const result = await database.pickingAddressModel().insertOne(data);
    return result;
  } catch (error) {
    return null;
  }
}
async function update(code, data) {
  try {
    data["updatedAt"] = new Date();
    const result = await database
      .pickingAddressModel()
      .findOneAndUpdate({ id: code }, { $set: data });
    return result;
  } catch (error) {
    return null;
  }
}
module.exports = {
  create,
  update,
  getOneByCode,
};
