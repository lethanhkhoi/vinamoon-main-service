const config = require("../config/app.json");
const client = require("twilio")(config.accountsId, config.smsToken);

async function sendSMS(req, res, next) {
  client.messages
    .create({
      body: "TEST",
      from: "+18305217644",
      to: "+84857916579",
    })
    .then((message) => {
      return res.json({
        errorCode: null,
        data: "Send sms success",
      });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = {
  sendSMS,
};
