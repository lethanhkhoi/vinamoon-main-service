const database = require("../utils/database")
async function getAll(){
    return await database.userModel().find().toArray()
}
async function create(data){
    return await database.userModel().insertOne(data)
}
module.exports={
    getAll,
    create
}