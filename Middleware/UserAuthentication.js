require('dotenv').config()
const jwt = require('jsonwebtoken')
const TokenBlacklist = require('../Model/TokenBlacklist')

const UserAuthentication = async(req, res, next) =>{
    const header = req.header('Authorization')
    if(!header || !header.startsWith('Bearer ')){
        res.json({'token_status': '1', 'msg': 'Invalid token'})
    }else{
        const token = header.split(' ')[1]


        const isBlackList = await TokenBlacklist.findOne({token})
        if (isBlackList) {
            res.json({'token_status': '3', 'msg': 'Token is Invalid'})
        }

        try {
            const verify = jwt.verify(token, process.env.JWT_USER_SECRET)
            req.user = verify
            next()
        } catch (error) {
            res.json({'token_status': '2', 'msg': error})
        }
    }
}

module.exports = UserAuthentication