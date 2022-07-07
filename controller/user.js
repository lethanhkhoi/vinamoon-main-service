const userCol = require('../dataModel/userCol')
const database = require('../utils/database')
const jwt = require("../utils/token")
const bcrypt = require("bcrypt")
const moment = require("moment")
const saltRounds = 10;

async function getAll (req,res){
    const data = await userCol.getAll()
    return res.json({data})
}
async function login(req,res){
    const user = await database.userModel().findOne({email: req.body.email})
    if(!user){
        return res.json({errorCode: true, data: "Tai khoan khong ton tai"})
    }
    const checkPass = await bcrypt.compare(req.body.password, user.password)
    // if(!checkPass){
    //     return res.json({errorCode: true, data: "Pass sai"})
    // }
    if(!user.token){
        user.token = await jwt.createSecretKey(req.body.email)
    }
    return res.json({errorCode: null,data: user})
}
async function register(req,res){
    const user = await database.userModel().findOne({email: req.body.email})
    if(user){
        return res.json({errorCode: true, data: "Tai khoan da ton tai"})
    }
    const checkPass = req.body.password == req.body.confirmPassword
    if(!checkPass){
        return res.json({errorCode: true, data: "Confirm password sai"})
    }
    const password = await bcrypt.hash(req.body.password, saltRounds)
    const data = {
        email: req.body.email,
        password: password,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        birthday: req.body.birthday? moment(req.body.birthday, "DD/MM/YYYY").utc().toDate(): null,
        voucher: [],
        createdAt: new Date()
    }
    await userCol.create(data)
    if(!data.token){
        data.token = await jwt.createSecretKey(req.body.email)
    }
    return res.json({errorCode: null,data: data})
}
module.exports={
    getAll,
    login,
    register
}