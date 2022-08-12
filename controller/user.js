const axios = require("axios");
const { ErrorHandler } = require("../middlewares/errorHandler");
// async function getAll(req, res) {
//   const data = await userCol.getAll();
//   return res.json({ errorCode: null, data });
// }
// async function login(req, res) {
//   const user = await database.userModel().findOne({ phone: req.body.phone });
//   if (!user) {
//     return res.json({ errorCode: true, data: "Tai khoan khong ton tai" });
//   }
//   const checkPass = await bcrypt.compare(req.body.password, user.password);
//   if (!checkPass) {
//     return res.json({ errorCode: true, data: "Pass sai" });
//   }
//   if (!user.token) {
//     const newToken = await jwt.createSecretKey({ phone: req.body.phone });
//     user.token = newToken.token;
//     user.refreshToken = newToken.refreshToken;
//     const data = {
//       status: "Log in",
//       token: user.token,
//       refreshToken: user.refreshToken,
//     };
//     refreshTokens[newToken.refreshToken] = data;
//   }
//   return res.json({ errorCode: null, data: user });
// }
// async function register(req, res) {
//   const user = await database.userModel().findOne({ phone: req.body.phone });
//   if (user) {
//     return res.json({ errorCode: true, data: "Tai khoan da ton tai" });
//   }
//   const checkPass = req.body.password == req.body.confirmPassword;
//   if (!checkPass) {
//     return res.json({ errorCode: true, data: "Confirm password sai" });
//   }
//   const password = await bcrypt.hash(req.body.password, saltRounds);
//   const data = {
//     password: password,
//     name: req.body.name,
//     phone: req.body.phone,
//     address: req.body.address,
//     gender: req.body.gender,
//     birthday: req.body.birthday
//       ? moment(req.body.birthday, "DD/MM/YYYY").utc().toDate()
//       : null,
//     role: req.body.role ? req.body.role : "user",
//     createdAt: new Date(),
//   };
//   await userCol.create(data);
//   if (!data.token) {
//     const newToken = await jwt.createSecretKey({ phone: req.body.phone });
//     data.token = newToken.token;
//     data.refreshToken = newToken.refreshToken;
//     const response = {
//       status: "Log in",
//       token: data.token,
//       refreshToken: data.refreshToken,
//     };
//     refreshTokens[newToken.refreshToken] = response;
//   }
//   return res.json({ errorCode: null, data: data });
// }
// async function verify(req, res, next) {
//   let token = req.headers["token"];
//   if (!token) {
//     return res.status(401).json({
//       errCode: true,
//       data: "authentication fail, don't have token",
//     });
//   }

//   try {
//     var payload = await jwt.decodeToken(token);
//   } catch (e) {
//     res.status(401);
//     return res.json({
//       errCode: true,
//       data: "jwt malformed",
//     });
//   }
//   if (!payload || !payload.phone) {
//     return res.status(401).json({
//       errCode: true,
//       data: "authentication fail",
//     });
//   }

//   let account = [];
//   account = await database.userModel().find({ phone: payload.phone }).toArray();

//   if (account.length == 0 || account.length > 1) {
//     res.status(401);
//     return res.json({
//       errCode: true,
//       data: "account not found",
//     });
//   }
//   account[0].token = token;

//   return res.json({
//     errCode: null,
//     data: account[0],
//   });
// }

// async function refreshToken(req, res) {
//   let { refreshToken } = req.body;
//   if (!refreshToken) {
//     return res.status(401).json({
//       errCode: true,
//       data: "authentication fail",
//     });
//   }

//   try {
//     var payload = await jwt.decodeRefreshToken(refreshToken);
//   } catch (e) {
//     res.status(401);
//     return res.json({
//       errCode: true,
//       data: "jwt malformed",
//     });
//   }
//   if (!payload || !payload.phone) {
//     return res.status(401).json({
//       errCode: true,
//       data: "authentication fail",
//     });
//   }
//   // if refresh token exists
//   if (refreshToken && refreshToken in refreshTokens) {
//     let account = [];
//     account = await database
//       .userModel()
//       .find({ phone: payload.phone })
//       .toArray();

//     if (account.length == 0 || account.length > 1) {
//       res.status(401);
//       return res.json({
//         errCode: true,
//         data: "account not found",
//       });
//     }
//     const newToken = await jwt.createSecretKey(
//       { phone: account[0].phone },
//       refreshToken
//     );
//     account[0].token = newToken.token;
//     refreshTokens[refreshToken].token = newToken.token;
//     // update the token in the list
//     refreshTokens[refreshToken].token = newToken.token;
//     return res.json({
//       errCode: null,
//       data: account[0],
//     });
//   } else {
//     res.status(404).send("Invalid request");
//   }
// }

async function userAuthentication(req, res, next) {
  try {
    let token = req.headers["token"];

    if (!token) {
      throw new ErrorHandler(401, "Authentication fail, don't have token");
    }
    axios({
      method: "get",
      url: "http://localhost:3002/verify",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((response) => {
        if (response.data.errorCode === true || response.status === 401) {
          // throw new ErrorHandler(401, "Authentication fail");
          return res.json({ errorCode: true, data: "Authen fail" });
        }
        console.log(response.data)
        const data = response.data.data;
        req.user = { _id: data._id, phone: data.phone, name: data.name };
        return next();
      })
      .catch((error) => {
        // throw new ErrorHandler(401, error.message);
        return res.json({ errorCode: true, data: "Authen fail" });
      });
  } catch (error) {
    // throw new ErrorHandler(401, error.message);
    return res.json({ errorCode: true, data: "Authen fail" });
  }
}
module.exports = {
  userAuthentication,
};
