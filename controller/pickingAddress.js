const pickingAddressCol = require("../dataModel/pickingAddressCol");
const { ErrorHandler } = require("../middlewares/errorHandler");
async function create(data, phone) {
  try {
    data.requests = [
      {
        phone,
        count: 1,
      },
    ];
    await pickingAddressCol.create(data);
    return data;
  } catch (error) {
    return null;
  }
}

async function getOne(req, res, next) {
  try {
    const code = req.params.code;
    const result = await pickingAddressCol.getOneByCode(code);
    if (!result) {
      throw new ErrorHandler(204, "Cannot find this address");
    }
    return res.json({ errorCode: null, data: result });
  } catch (error) {
    next(error);
  }
}

async function getFrequency(req, res, next) {
  try {
    const phone = req.body.phone;
    const result = await pickingAddressCol.getFrequency(phone);
    if (!result) {
      throw new ErrorHandler(204, "Cannot find this frequency address");
    }
    return res.json({ errorCode: null, data: result });
  } catch (error) {
    next(error);
  }
}

async function getAll(req, res) {
  try {
    const result = await pickingAddressCol.getAll();
    if (!result) {
      throw new ErrorHandler(204, "Cannot get all addresses");
    }
    return res.json({ errorCode: null, data: result });
  } catch (error) {
    return res.json({
      errorCode: true,
      exitCode: 1,
      data: "system error",
    });
  }
}

module.exports = {
  create,
  getOne,
  getFrequency,
  getAll,
};
