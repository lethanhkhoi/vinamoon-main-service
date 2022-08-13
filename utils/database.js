const { MongoClient } = require("mongodb");
const config = require("../config/database.json");

let _userModel = null;
let _requestModel = null;
let _pickingAddressModel = null;
let _vehicleModel = null;
async function connectDatabase(cb) {
  const client = new MongoClient(config.uri);
  try {
    await client.connect();
    let db = await client.db("bus");

    // Authentication
    _userModel = db.collection("user");
    _requestModel = db.collection("request");
    _pickingAddressModel = db.collection("picking_address");
    _vehicleModel = db.collection("vehicle_type");
    dbClient = client;

    cb();
  } catch (e) {
    console.error(e);
  }
}
// Authentication

const userModel = function () {
  if (_userModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _userModel;
  }
};

const requestModel = function () {
  if (_requestModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _requestModel;
  }
};

const pickingAddressModel = function () {
  if (_pickingAddressModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _pickingAddressModel;
  }
};

const vehicleModel = function () {
  if (_vehicleModel == null) {
    console.log("Instance is null or undefined");
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
