const requestBus = require("../dataModel/requestBusCol");
async function getAll(req, res) {
  const data = await requestBus.getAll();
  return res.json({ errorCode: null, data });
}
async function create(req,res){
    const data = req.body
    for (property in requestBus.validateRequest){
        if(data[property] === null){
            return res.json({errorCode: true, data: `Please input ${property}`})
        }
    }
    data.date = new Date()
    data.status = "Pending"
    const result = await requestBus.create(data)
    if (!result) {
        return res.json({ errorCode: true, data: "System error" });
      }
      return res.json({ errorCode: null, data: data });
}
module.exports = {
  getAll,
  create
};
