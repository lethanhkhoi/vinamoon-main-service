const config = require("../config/app.json");
const SMS = require("../utils/sms");
const client = require("twilio")(config.accountsId, config.smsToken);
async function sendSMS(req, res) {
  client.messages
    .create({
      body: "TEST",
      from: "+18305217644",
      to: "+84919881497",
    })
    .then((message) => {
      console.log(message);
      return res.json({
        errorCode: null,
        data: "send sms success",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.json({
        errorCode: true,
        data: error,
      });
    });
}

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
