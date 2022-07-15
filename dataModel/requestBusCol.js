const database = require("../utils/database")
const { dataPagination } =require("../helperFunction/helper") 
const validateRequest = [
    "phone",
    "name",
    "pickingAddress",
    "seat"
]
function joinAdress(aggregate = []) {
    aggregate.push({
      $lookup: {
        from: "request",
        localField: "pickingaddress",
        foreignField: "_id",
        as: "location",
      },
    });
    aggregate.push({
      $unwind: { path: "$request", preserveNullAndEmptyArrays: true },
    });
    return aggregate;
  }
async function getAll(){
    let pipeline = null
    const sortBy={
        createdAt: -1
    }
    pipeline = dataPagination({}, sortBy, 1,1000, joinAdress())
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