const { MongoClient } = require("mongodb");
const config = require("../config/constant");
const { ErrorHandler } = require("../middlewares/errorHandler");

let _userModel = null;
let _requestModel = null;
let _pickingAddressModel = null;
let _vehicleModel = null;
async function connectDatabase(cb) {
  const client = new MongoClient(config.database.BUS);
  try {
    await client.connect();
    let db = client.db("bus");

    // Authentication
    _userModel = db.collection("user");
    _requestModel = db.collection("request");
    _pickingAddressModel = db.collection("picking_address");
    _vehicleModel = db.collection("vehicle_type");

    cb();
  } catch (e) {
    console.error(e);
  }
}
// Authentication

const userModel = function () {
  if (_userModel == null) {
    throw new ErrorHandler(500, "bus user table is null or undefined");
  } else {
    return _userModel;
  }
};

const requestModel = function () {
  if (_requestModel == null) {
    throw new ErrorHandler(500, "bus request table is null or undefined");
  } else {
    return _requestModel;
  }
};

const pickingAddressModel = function () {
  if (_pickingAddressModel == null) {
    throw new ErrorHandler(
      500,
      "bus picking_address table is null or undefined"
    );
  } else {
    return _pickingAddressModel;
  }
};

const vehicleModel = function () {
  if (_vehicleModel == null) {
    throw new ErrorHandler(500, "bus vehicle_type table is null or undefined");
  } else {
    return _vehicleModel;
  }
};

module.exports = {
  userModel,
  requestModel,
  pickingAddressModel,
  connectDatabase,
  vehicleModel,
};
