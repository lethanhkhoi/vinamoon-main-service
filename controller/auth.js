const axios = require("axios");
const { ErrorHandler } = require("../middlewares/errorHandler");
async function userAuthentication(req, res, next) {
  try {
    let token = req.headers["token"];

    if (!token) {
      throw new ErrorHandler(401, "Authentication fail, don't have token");
    }
    const response = await axios({
      method: "get",
      url: "http://localhost:3002/verify",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    if (response.data.errorCode === true || response.status === 401) {
      throw new ErrorHandler(401, "Authentication fail");
    }
    const data = response.data.data;
    req.user = { _id: data._id, phone: data.phone, name: data.name };
    return next();
  } catch (err) {
    next(err);
  }
}
module.exports = {
  userAuthentication,
};
