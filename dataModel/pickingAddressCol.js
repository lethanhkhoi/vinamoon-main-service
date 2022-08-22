const database = require("../utils/database");
const { requestConstant } = require("../config/constant");

function joinAddress(phone, aggregate = []) {
  aggregate.push(
    { $match: { "requests.phone": phone } },
    { $sort: { "requests.count": -1 } },
    { $limit: 5 }
  );
  return aggregate;
}

async function removeOneByCode(code) {
  try {
    const result = await database.pickingAddressModel().deleteOne({ id: code });
    return result;
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

async function getFrequency(phone) {
  try {
    const result = await database
      .pickingAddressModel()
      .aggregate(joinAddress(phone))
      .toArray();
    return result;
  } catch (error) {
    return null;
  }
}

async function getNearest(location) {
  try {
    const result = await database
      .pickingAddressModel()
      .aggregate([
        {
          $geoNear: {
            near: [location.long, location.lat],
            spherical: true,
            distanceField: "distance",
            maxDistance: requestConstant.MAX_DISTANCE / 10_000_000,
            distanceMultiplier: 10_000_000,
          },
        },
        { $sort: { distance: 1 } },
        { $limit: 1 },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.log(error);
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

async function getAll() {
  try {
    return await database.pickingAddressModel().find().toArray();
  } catch (error) {
    return null;
  }
}

module.exports = {
  create,
  update,
  getOneByCode,
  getFrequency,
  getAll,
  getNearest,
  removeOneByCode,
};
