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
async function insertMany(data) {
  try {
    const result = await database.requestLogModel().insertMany(data);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAll,
  create,
  insertMany,
};
