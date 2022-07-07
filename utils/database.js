const { MongoClient } = require("mongodb");
const config = require('../config/database.json');

let _userModel =null
async function connectDatabase(cb) {
    const client = new MongoClient(config.uri);
    try {
      await client.connect();
      let db = await client.db('Ecommerce');
      console.log("connect to DB Success", config.uri);
  
      // Authentication
      _userModel = db.collection("User");
  
      dbClient = client;
  
      cb();
    } catch (e) {
      console.error(e);
    }
}
// Authentication

const userModel = function () {
    if (_userModel == null) {
      console.log("Instance is null or undefined");
    } else {
      return _userModel;
    }
};
module.exports ={
    userModel,
    connectDatabase
}