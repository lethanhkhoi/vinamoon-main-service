const SMS = require("../utils/sms");
const formatter = require("../utils/formatter");

async function sendSMS(req, res, next) {
  try {
    const data = req.body;

    const to = formatter.phoneFormat(data.to);

    await SMS.pickUp(to, data.requestId, data.driver);

    return res.json({
      errorCode: null,
      data: "Send sms success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  sendSMS,
};
