const database = require("../utils/database");

async function getOne(data) {
  try {
    let match = {
      $and: [
        {
          homeNo: new RegExp([data["homeNo"]].join(""), "i"),
        },
        {
          street: new RegExp([data["street"]].join(""), "i"),
        },
        {
          district: new RegExp([data["district"]].join(""), "i"),
        },
        {
          city: new RegExp([data["city"]].join(""), "i"),
        },
        {
          ward: new RegExp([data["ward"]].join(""), "i"),
        },
      ],
    };
    const result = await database
      .pickingAddressModel()
      .aggregate([{ $match: match }])
      .toArray();
    if (!result || result.length > 1) {
      return null;
    }
    return result[0];
  } catch (error) {
    return null;
  }
}

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
  getOne,
  create,
  update,
  getOneByCode,
};
