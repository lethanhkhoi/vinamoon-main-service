const config = require("../config/app.json");
const client = require("twilio")(config.accountsId, config.smsToken);

const fromNumber = "+17472479024";

const SMS = {
  async sendSms(to, body) {
    const result = await client.messages.create({
      body: body,
      from: fromNumber,
      to: to,
    });
    return result;
  },

  async confirmBooking(to, requestId) {
    const result = await client.messages.create({
      body: `[VINAMOON]\n
      Cuốc xe đã được tạo. Chúng tôi đang tìm tài xế cho bạn...\n
      Mã cuốc: ${requestId}\n`,
      from: fromNumber,
      to: to,
    });
    return result;
  },

  async pickUp(to, id, driver) {
    const result = await client.messages.create({
      body: `[VINAMOON]\n
      Tài xế ${driver.name} đã nhận chuyến\n
      SĐT tài xế: ${driver.phone}\n
      Biển số xe: ${driver.vehicle}\n
      Mã cuốc: ${id}\n`,
      from: fromNumber,
      to: to,
    });
    return result;
  },
};

module.exports = SMS;
