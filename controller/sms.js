const axios = require("axios");
const config = require("../config/app.json");
const client = require("twilio")(config.accountsId, config.smsToken);
async function sendSMS(req, res) {
  client.messages
    .create({
      body: "TEST",
      from: "+18305217644",
      to: "+84857916579",
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

module.exports = {
  sendSMS,
};
