const database = require("../utils/databaseLog");

async function getAll() {
  try {
    const result = await database.requestLogModel().find().toArray();
    return result;
  } catch (error) {
    return null;
  }
}
async function create(data) {
  try {
    const result = await database.requestLogModel().insertOne(data);
    return result;
  } catch (error) {
    return null;
  }
}

module.exports = {
  getAll,
  create,
};
