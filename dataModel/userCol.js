const ObjectID = require("mongodb").ObjectId;
const { VehicleType } = require("@googlemaps/google-maps-services-js");
const logger = require("../logger/winston");
const database = require("../utils/database");

// const validateRequest = ["phone", "name", "pickingAddress", "vehicleId"];
async function getAll() {
  try {
    const sort = {
      role: 1,
    };
    let users = await database
      .userModel()
      .aggregate([{ $sort: sort }])
      .toArray();

    users.forEach((element) => {
      delete element.refreshToken;
      delete element.password;
      console.log(element);
    });

    return users;
  } catch (error) {
    return null;
  }
}

async function update(_user) {
  try {
    const _id = _user._id;
    delete _user._id;
    if (_user.role !== "driver") {
      _user = {
        ..._user,
        vehicle: null,
      };
    }
    const result = await database
      .userModel()
      .findOneAndUpdate(
        { _id: new ObjectID(_id) },
        { $set: _user },
        { upsert: true }
      );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  getAll,
  update,
  //   create,
  //   getOne,
};
