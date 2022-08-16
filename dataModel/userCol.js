const ObjectID = require("mongodb").ObjectId;
const database = require("../utils/database");
const { config } = require("../config/constant");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

// const validateRequest = ["phone", "name", "pickingAddress", "vehicleId"];
async function getAll() {
  try {
    const sort = {
      role: 1,
    };
    let users = await database
      .userModel()
      .aggregate([
        { $sort: sort },
        {
          $lookup: {
            from: "vehicle_type",
            localField: "vehicle.typeId",
            foreignField: "id",
            as: "vehicleData",
          },
        },
      ])
      .toArray();

    users.forEach((element) => {
      delete element.refreshToken;
      delete element.password;
      if (element?.vehicleData[0]?.name) {
        element.vehicle = {
          ...element.vehicle,
          name: element.vehicleData[0].name,
        };
      }
      delete element.vehicleData;
    });

    console.log(users);
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

async function create(_user) {
  try {
    var hashPassword = bcrypt.hashSync(
      _user.password || config.DEFAULT_PASSWORD,
      salt
    );

    _user = {
      ..._user,
      password: hashPassword,
    };

    const result = await database.userModel().insertOne(_user);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  getAll,
  update,
  create,
  //   getOne,
};
