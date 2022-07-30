const requestBus = require("../dataModel/requestBusCol");
const pickingAddress = require("./pickingAddress.js");
const ObjectID = require("mongodb").ObjectId;

async function getAll(req, res, next) {
  try {
    let data = await requestBus.getAll();
    data[0].data.map(
      (item) => (item.pickingLocation = item.pickingLocation[0])
    );
    return res.json({ errorCode: null, data: data[0].data });
  } catch (error) {
    next(error);
  }
}
async function create(req, res, next) {
  try {
    const data = req.body;
    const user = req.body.phone ?? req.user.phone;
    for (property in requestBus.validateRequest) {
      if (data[property] === null) {
        return res.status(200).send({
          errorCode: true,
          exitCode: 1,
          data: "Missing property",
        });
      }
    }
    data.date = new Date();
    data.status = "Pending";
    data.id = ObjectID().toString();
    const pickingAddressResult = await pickingAddress.create(
      data.pickingAddress,
      user,
      data.pickingAddress.pickingId
    );
    if (!pickingAddressResult) {
      return res.status(200).send({
        errorCode: true,
        exitCode: 1,
        data: "Cannot create picking address",
      });
    }
    data.pickingAddress = pickingAddressResult.id;
    const result = await requestBus.create(data);
    if (!result) {
      return res.status(200).send({
        errorCode: true,
        exitCode: 1,
        data: "Cannot create request",
      });
    }
    return res.json({ errorCode: null, data: data });
  } catch (error) {
    next(error);
  }
}
async function getOne(req, res, next) {
  try {
    const code = req.params.code;
    let result = await requestBus.getOne(code);
    if (!result) {
      return res.status(200).send({
        errorCode: true,
        exitCode: 1,
        data: "Cannot find request",
      });
    }
    result.pickingLocation = result.pickingLocation[0];
    return res.json({ errorCode: null, data: result });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getAll,
  create,
  getOne,
};
