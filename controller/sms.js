const SMS = require("../utils/sms");

async function sendSMS(req, res, next) {
  try {
    const result = await SMS.sendSms("+84857916579", "Nhan duoc khong Nhan?");

    console.log(result);
    return res.json({
      errorCode: null,
      data: "Send sms success",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendSMS,
};
