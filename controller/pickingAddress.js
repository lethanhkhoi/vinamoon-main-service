const pickingAddressCol = require("../dataModel/pickingAddressCol");
const ObjectID = require("mongodb").ObjectId;
async function create(data, phone, pickingId) {
  try {
    let result = null;
    if (data.pickingId) {
      result = await pickingAddressCol.getOneByCode(pickingId);
    }
    let created = null;
    if (!result) {
      data.lat = null;
      data.long = null;
      data.id = ObjectID().toString();
      data.requests = [
        {
          phone,
          count: 1,
        },
      ];
      await pickingAddressCol.create(data);
      created = data;
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
      const update = await pickingAddressCol.update(result.id, result);
      created = update.value;
    }
    return created;
  } catch (error) {
    return null;
  }
}
async function getOne(req, res) {
  try {
    const code = req.params.code;
    const result = await pickingAddressCol.getOneByCode(code);
    if (!result) {
      return res.json({ errorCode: true, data: `Cannot find this address` });
    }
    return res.json({ errorCode: null, data: result });
  } catch (error) {
    return res.json({ errorCode: true, data: `System error` });
  }
}
async function getFrequency(req, res) {
  try {
    const phone = req.body.phone;
    const result = await pickingAddressCol.getFrequency(phone);
    if (!result) {
      return res.json({ errorCode: true, data: `Cannot find this address` });
    }
    return res.json({ errorCode: null, data: result });
  } catch (error) {
    return res.json({ errorCode: true, data: `System error` });
  }
}
module.exports = {
  create,
  getOne,
  getFrequency
};
