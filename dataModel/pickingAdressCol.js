const database = require("../utils/database");

async function getOne(data) {
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
  const result = await database.pickingAdressModel().aggregate([{$match : match}]).toArray();
  if (!result || result.length > 1) {
    return null;
  }
  return result[0];
}
async function create(data){
    data["createdAt"] = new Date()
    const result = await database.pickingAdressModel().insertOne(data)
    return result
}
async function update(code, data){
    data["updatedAt"] = new Date()
    const result = await database.pickingAdressModel().findOneAndUpdate(
        { id: code },
        { $set: data }
      );
    return result
}
module.exports = {
  getOne,
  create,
  update
};
