const ObjectID = require("mongodb").ObjectId;
const database = require("../utils/database");
const { role } = require("../config/constant");

// const validateRequest = ["phone", "name", "pickingAddress", "vehicleId"];
async function getAll(query) {
  try {
    const sort = {
      role: 1,
    };
    aggArray = [
      { $sort: sort },
      {
        $lookup: {
          from: "vehicle_type",
          localField: "vehicle.typeId",
          foreignField: "id",
          as: "vehicleData",
        },
      },
    ];
    if (query) {
      aggArray.push({
        $match: query,
      });
    }
    let users = await database.userModel().aggregate(aggArray).toArray();

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
    return users;
  } catch (error) {
    return null;
  }
}

async function update(_user) {
  try {
    const _id = _user._id;
    delete _user._id;
    if (_user.role !== role.DRIVER) {
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
