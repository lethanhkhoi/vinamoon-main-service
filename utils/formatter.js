function phoneFormat(phone) {
  try {
    const regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    phone = phone.replace(/[^\d]/g, "");

    if (phone.length == 10 && phone[0] == "0" && regex.test(phone)) {
      return phone.replace(/(\d{1})/, "+84");
    }
    return null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  phoneFormat,
};
