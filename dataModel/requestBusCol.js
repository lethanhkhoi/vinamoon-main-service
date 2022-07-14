const database = require("../utils/database")

const validateRequest = [
    "phone",
    "name",
    "pickingAddress",
    "seat"
]
async function getAll(){
    return await database.requestModel().find().toArray()
}
async function create(data){
    const result = await database.requestModel().insertOne(data)
    return result
}

module.exports={
    getAll,
    create,
    validateRequest
}