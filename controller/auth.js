const axios = require("axios");
const { ErrorHandler } = require("../middlewares/errorHandler");
const API_AUTHENTICATION = process.env.AUTHENTICATION;
async function userAuthentication(req, res, next) {
  try {
    let token = req.headers["token"];

    if (!token) {
      throw new ErrorHandler(401, "Authentication fail, don't have token");
    }

    try {
      const response = await axios({
        method: "get",
        url: `${API_AUTHENTICATION}/verify`,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      const data = response.data.data;
      req.user = { _id: data._id, phone: data.phone, name: data.name };
      return next();
    } catch (err) {
      throw new ErrorHandler(
        err.response?.status || 401,
        err.response?.data?.message || "Authentication fail, invalid token"
      );
    }
  } catch (err) {
    next(err);
  }
}
module.exports = {
  userAuthentication,
};
