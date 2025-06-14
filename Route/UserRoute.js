const express = require('express')

const router = express.Router()

const {testUser, registerUser, loginUser, addLinkQR, getQRLink, logoutUser, forgotPassword, resetPassword, deleteQR, editQR} = require('../Controller/UserController')
const userAuth = require('../Middleware/UserAuthentication')

// http://localhost:5000/userapi/userdata
router.get('/userdata', userAuth, testUser)

// http://localhost:5000/userapi/getQRLink
router.get('/getQRLink', userAuth, getQRLink)

// http://localhost:5000/userapi/deleteQR/:qrId
router.get('/deleteQR/:qrId', userAuth, deleteQR)

// http://localhost:5000/userapi/editQR/:qrId
router.post('/editQR/:qrId', userAuth, editQR)

// http://localhost:5000/userapi/logoutUser
router.get('/logoutUser', logoutUser)

// http://localhost:5000/userapi/addLinkQR
router.post('/addLinkQR', userAuth, addLinkQR)

// http://localhost:5000/userapi/registerUser
router.post('/registerUser', registerUser)

// http://localhost:5000/userapi/loginUser
router.post('/loginUser', loginUser)

// http://localhost:5000/userapi/forgotPassword
router.post('/forgotPassword', forgotPassword)

// http://localhost:5000/userapi/resetPassword/token
router.post('/resetPassword/:token', resetPassword)


module.exports = router