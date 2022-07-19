const requestBus = require("../dataModel/requestBusCol");
const pickingAddress = require("./pickingAddress.js");
const ObjectID = require("mongodb").ObjectId;
async function getAll(req, res) {
  const data = await requestBus.getAll();
  return res.json({ errorCode: null, data: data[0].data });
}
async function create(req, res) {
  const data = req.body;
  const user = req.body.phone ?? req.user.phone;
  for (property in requestBus.validateRequest) {
    if (data[property] === null) {
      return res.json({ errorCode: true, data: `Please input ${property}` });
    }
  }
  data.date = new Date();
  data.status = "Pending";
  data.id = ObjectID().toString();
  const pickingAddressResult = await pickingAddress.create(data.pickingAddress, user)
  if (!pickingAddressResult) {
    return res.json({ errorCode: true, data: "System error" });
  }
  data.pickingAddress = pickingAddressResult.id
  const result = await requestBus.create(data);
  if (!result) {
    return res.json({ errorCode: true, data: "System error" });
  }
  return res.json({ errorCode: null, data: data });
}
async function getOne(req, res) {
  const code = req.params.code;
  let result = await requestBus.getOne(code);
  if (!result) {
    return res.json({ errorCode: true, data: "Cannot found the request" });
  }
  result.pickingLocation = result.pickingLocation[0]
  return res.json({ errorCode: null, data: result });
}
module.exports = {
  getAll,
  create,
  getOne,
};
