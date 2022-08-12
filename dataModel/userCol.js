const ObjectID = require("mongodb").ObjectId;
const database = require("../utils/database");

// const validateRequest = ["phone", "name", "pickingAddress", "vehicleId"];
async function getAll() {
  try {
    const sort = {
      role: -1,
    };
    let users = await database
      .userModel()
      .aggregate([{ $sort: sort }])
      .toArray();

    users.forEach((element) => {
      console.log(element);
      delete element.refreshToken;
      delete element.password;
    });

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// async function create(data) {
//   try {
//     const result = await database.requestModel().insertOne(data);
//     return result;
//   } catch (error) {
//     return null;
//   }
// }

// async function getOne(code) {
//   try {
//     const result = await database
//       .requestModel()
//       .aggregate([
//         ...joinAdress(),
//         {
//           $match: { id: code },
//         },
//       ])
//       .toArray();
//     return result[0];
//   } catch (error) {
//     return null;
//   }
// }

module.exports = {
  getAll,
  //   create,
  //   getOne,
};
