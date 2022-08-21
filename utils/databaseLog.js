const { MongoClient } = require("mongodb");
const config = require("../config/constant");
const { ErrorHandler } = require("../middlewares/errorHandler");

let _requestLogModel = null;
let _logModel = null;

async function connectDatabase(cb, next) {
  const client = new MongoClient(config.database.LOG);
  try {
    await client.connect();
    let db = client.db("log");

    _logModel = db.collection("log");
    _requestLogModel = db.collection("request");

    cb();
  } catch (e) {
    next(e);
  }
}

const requestLogModel = function () {
  if (_requestLogModel == null) {
    throw new ErrorHandler(500, "log request table is null or undefined");
  } else {
    return _requestLogModel;
  }
};

const logModel = function () {
  if (_logModel == null) {
    throw new ErrorHandler(500, "log table is null or undefined");
  } else {
    return _logModel;
  }
};

module.exports = {
  requestLogModel,
  logModel,
  connectDatabase,
};
