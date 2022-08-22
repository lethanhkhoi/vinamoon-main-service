const config = require("../config/app.json");
const client = require("twilio")(config.accountsId, config.smsToken);

const SMS = {
  async sendSms(to, body) {
    const result = await client.messages.create({
      body: body,
      from: "+18305217644",
      to: to,
    });
    return result;
  },

  async confirmBooking(to, requestId) {
    const result = await client.messages.create({
      body: `[VINAMOON]\n
      Cuốc xe đã được tạo. Chúng tôi đang tìm tài xế cho bạn...\n
      Mã cuốc: ${requestId}\n`,
      from: "+18305217644",
      to: to,
    });
    return result;
  },
};

module.exports = SMS;
