const ObjectID = require("mongodb").ObjectId;
const { requestStatus } = require("../config/constant");

const cleanObj = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};

module.exports = {
  cleanObj,
};
