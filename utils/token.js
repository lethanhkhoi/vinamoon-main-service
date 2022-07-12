const jwt = require("jsonwebtoken")
const config = require("../config/app.json")
const createSecretKey =async (payload, refreshToken = null)=>{
    const options ={
        expiresIn: 1800,
        refreshToken: 604800,
    }
    const token = {
        token: jwt.sign(payload, config.tokenKey, {expiresIn: options.expiresIn}),
        refreshToken: refreshToken ?? jwt.sign(payload, config.refreshTokenKey, {expiresIn: options.refreshToken})
    } 
    return token
}
const decodeToken = async(token)=>{
    return jwt.verify(token, config.tokenKey)
}

const decodeRefreshToken = async(token)=>{
    return jwt.verify(token, config.refreshTokenKey)
}

module.exports={
    createSecretKey,
    decodeToken,
    decodeRefreshToken
}