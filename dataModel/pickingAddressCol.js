const database = require("../utils/database");

function joinAddress(phone, aggregate = []) {
  console.log('tesst')
  aggregate.push(
    {$match: {'requests.phone': phone}},
    {$sort: {'requests.count': -1} },
    {$limit: 5}
  );
  return aggregate;
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
async function getAll(){
  try{
    return await database.pickingAddressModel().find().toArray()
  }catch(error){
    return null
  }
}
module.exports = {
  create,
  update,
  getOneByCode,
  getFrequency,
  getAll
};
