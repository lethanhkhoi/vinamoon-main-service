const { NetworkContext } = require("twilio/lib/rest/supersim/v1/network");
const user = require("../dataModel/userCol");
const ObjectID = require("mongodb").ObjectId;

// async function create(data, phone) {
//   try {
//     data.lat = null;
//     data.long = null;
//     data.id = ObjectID().toString();
//     data.requests = [
//       {
//         phone,
//         count: 1,
//       },
//     ];
//     await pickingAddressCol.create(data);
//     return data;
//   } catch (error) {
//     return null;
//   }
// }

// async function getOne(req, res, next) {
//   try {
//     const code = req.params.code;
//     const result = await pickingAddressCol.getOneByCode(code);
//     if (!result) {
//       return res.status(200).send({
//         errorCode: true,
//         exitCode: 1,
//         data: "Cannot find this address",
//       });
//     }
//     return res.json({ errorCode: null, data: result });
//   } catch (error) {
//     next(error);
//   }
// }

async function getAll(req, res, next) {
  try {
    const result = await user.getAll();
    if (!result) {
      throw new ErrorHandler(204, "Cannot get all users");
    }
    return res.json({ errorCode: null, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  //   create,
  //   getOne,
  getAll,
};
