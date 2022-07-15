const pickingAdressCol = require("../dataModel/pickingAdressCol");
const ObjectID = require("mongodb").ObjectId;
async function create(data, phone) {
  let result = await getOne(data);
  let created = null;
  if (!result) {
    data.lat = null;
    data.long = null;
    data.id = ObjectID().toString()
    data.requests = [
      {
        phone,
        count: 1,
      },
    ];
    await pickingAdressCol.create(data);
    created = data
  } else {
    let requests = result.requests;
    const requestPhone = requests.map((item) => item.phone);
    for (let i = 0; i < requests.length; i++) {
      if (requests[i].phone === phone) {
        requests[i].count += 1;
      }
    }
    if (!requestPhone.includes(phone)) {
      requests.push({
        phone,
        count: 1,
      });
    }
    result.requests = requests;
    const update = await pickingAdressCol.update(result.id, result);
    created = update.value;
  }
  return created;
}
async function getOne(data) {
  return await pickingAdressCol.getOne(data);
}
module.exports = {
  create,
  getOne,
};
