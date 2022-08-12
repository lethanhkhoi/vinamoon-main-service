const vehicleCol = require("../dataModel/vehicleCol");
const ObjectID = require("mongodb").ObjectId;
async function create(req, res) {}

async function getOne(req, res) {
  try {
  } catch (error) {}
}

async function update(req, res) {
  try {
    const code = req.params.code;
    const data = req.body;
    const update = await vehicleCol.update(code, data);
    if (!update) {
      return res.json({ errorCode: true, data: "System error" });
    }
    for (property of vehicleCol.vehicleProperties) {
      if (req.body[property]) {
        update[property] = req.body[property];
      }
    }
    return res.json({ errorCode: false, data: update });
  } catch (error) {}
}

async function getAll(req, res) {
  try {
    const vehicles = await vehicleCol.getAll();
    return res.json({ errorCode: null, data: vehicles });
  } catch (error) {
    return res.json({
      errorCode: true,
      exitCode: 1,
      data: "system error",
    });
  }
}

async function create(req, res) {
  try {
    let data = req.body;
    data.id = ObjectID().toString();
    for (property of vehicleCol.creatValidation) {
      if (!data[property]) {
        return res.json({ errorCode: true, data: `Please input ${property}` });
      }
    }
    const vehicle = await vehicleCol.create(data);
    if (!vehicle) {
      return res.json({ errorCode: true, data: "System error" });
    }
    return res.json({ errorCode: null, data: data });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

async function update(req, res) {
  try {
    const code = req.params.code;
    const data = req.body;
    const update = await vehicleCol.update(code, data);
    if (!update) {
      return res.json({ errorCode: true, data: "System error" });
    }
    for (property of vehicleCol.vehicleProperties) {
      if (req.body[property]) {
        update[property] = req.body[property];
      }
    }
    return res.json({ errorCode: false, data: update });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

module.exports = {
  create,
  update,
  getAll,
};
