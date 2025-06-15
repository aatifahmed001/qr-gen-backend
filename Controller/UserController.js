require('dotenv').config()
const bcrypt = require('bcryptjs')
const UserModel = require('../Model/User')
const LinkQRModel = require('../Model/LinkQR')
const ResetPasswordModel = require('../Model/ResetPassword')
const jwt = require('jsonwebtoken')
const TokenBlacklistModel = require('../Model/TokenBlacklist')
const nodemailer = require("nodemailer")
const crypto = require('crypto')


// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth:{
//         user: process.env.EMAIL_USER,
//         passwrod: process.env.EMAIL_PASSWORD
//     }
// })

exports.testUser = async (req, res) => {
    res.json({
        msg: 'This is test user...'
    })
}

exports.addLinkQR = async (req, res) => {
    const qrLink = req.body.qrLink
    const qrColor = req.body.qrColor
    const user = req.user.id

    try {
        const newLinkQR = LinkQRModel({
            qrLink,
            qrColor,
            user
        })

        const saveQR = await newLinkQR.save()
        res.json(saveQR)

    } catch (error) {
        res.json({ "error": error })
    }
}

exports.getQRLink = async (req, res) => {
    try {
        const qrLinks = await LinkQRModel.find({ user: req.user.id })
        res.json(qrLinks)
    } catch (error) {
        res.json({ 'error': error })
    }
}

exports.editQR = async (req, res) => {
    const { qrId } = req.params
    const qrLink = req.body.qrLink
    const qrColor = req.body.qrColor

    try {
        const updateQR = await LinkQRModel.findByIdAndUpdate(
            qrId,
            {qrLink, qrColor},
            {new: true}
        )
        res.json(updateQR)
    } catch (error) {
        res.json({ 'error': error })
    }
}

exports.deleteQR = async (req, res) => {
    const { qrId } = req.params
    try {
        const deleteQR = await LinkQRModel.findOneAndDelete(qrId)
        if (deleteQR) {
            res.json({ "deleteStatus": true, "msg": "QR deleted successfully" })
        } else {
            res.json({ "deleteStatus": false, "msg": "QR has not deleted" })

        }
    } catch (error) {
        res.json({ "error": error })
    }
}

exports.registerUser = async (req, res) => {
    const uname = req.body.uname
    const uemail = req.body.uemail
    const upassword = await bcrypt.hash(req.body.upassword, 12)

    try {
        const newUser = new UserModel({
            'user_name': uname,
            'user_email': uemail,
            'user_password': upassword
        })

        const saveUser = await newUser.save()
        res.json({ saveUser })
    } catch (error) {
        console.log('error:', error)
        res.status(500).json({ error: 'Internal server error' }); // this is important!
    }
}

exports.loginUser = async (req, res) => {
    const uemail = req.body.uemail
    const upassword = req.body.upassword

    try {
        const userLogin = await UserModel.findOne({ 'user_email': uemail })
        if (!userLogin) {
            res.json({ 'loginStatus': '1', 'msg': 'User not found' })
        } else {
            const isMatch = await bcrypt.compare(upassword, userLogin.user_password)

            if (!isMatch) {
                res.json({ 'loginStatus': '2', 'msg': 'Wrong Password' })
            } else {
                const token = jwt.sign(
                    { id: userLogin._id, user_email: userLogin.user_email },
                    process.env.JWT_USER_SECRET,
                    { expiresIn: '30m' }
                )

                res.json({ 'loginStatus': '0', 'authToken': token })
            }
        }
    } catch (error) {
        console.log('error:', error)
    }
}

exports.logoutUser = async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1]
    if (!token) {
        res.json({ "msg": "No token Found." })
    }
    try {
        const tokenData = new TokenBlacklistModel({ token })
        const saveBlacklistToken = await tokenData.save()
        res.json(saveBlacklistToken)
    } catch (error) {
        res.json({ "error": error })
    }
}

exports.forgotPassword = async (req, res) => {
    const user_email = req.body.email

    try {
        const user = await UserModel.findOne({ user_email })

        if (!user) {
            res.json({ "msg": "User not found." })
        }

        const token = crypto.randomBytes(32).toString('hex')
        const hashToken = await bcrypt.hash(token, 10)

        await ResetPasswordModel.deleteMany({ userId: user._id })

        const newReset = new ResetPasswordModel({
            userId: user._id,
            reset_token: hashToken
        })

        await newReset.save()

        const resetLink = `${process.env.CLIENT_URL}/resetPassword/${token}`
        // await transporter.sendMail({
        //     to: user.user_email,
        //     subject: "QR Generator Forgot Password link",
        //     html: `
        //     <h1>Click the link below to reset the password</h1>
        //     <a href="${resetLink}"></a>`
        // })
        res.json({ "msg": "Reset password link sent to your email", "reset_link": resetLink })
    } catch (error) {
        res.json({ "error": error })
    }
}

// exports.resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const user_password = req.body.password; // fixed typo

//     if (!user_password) {
//         return res.status(400).json({ resetStatus: false, msg: "Password is required." });
//     }

//     try {
//         const resetToken = await ResetPasswordModel.findOne({ 
//             reset_token: token,
//             expires: { $gt: Date.now() }
//          });
//         console.log('resetToken:', resetToken)
//         if (!resetToken) {
//             return res.status(400).json({ resetStatus: false, msg: "Invalid or Expired link" });
//         }

//         const hashedPassword = await bcrypt.hash(user_password, 12);

//         await UserModel.findOneAndUpdate(
//             { _id: resetToken.userId },
//             { $set: { user_password: hashedPassword } },
//             { new: true }
//         );

//         await ResetPasswordModel.deleteMany({ "reset_token": token });

//         res.json({ resetStatus: true, msg: "Your Password updated successfully." });
//     } catch (error) {
//         console.error("Reset password error:", error);
//         res.status(500).json({ resetStatus: false, msg: "Internal server error", error });
//     }
// };


exports.resetPassword = async (req, res) => {
    const { token } = req.params
    const user_password = req.body.password

    try {
        const resetRecords = await ResetPasswordModel.find({});
        let resetToken = null;

        for (const record of resetRecords) {
            const match = await bcrypt.compare(token, record.reset_token);
            if (match) {
                resetToken = record;
                break;
            }
        }

        // this is not working bcz we are comparing a token with hash token
        // const resetToken = await ResetPasswordModel.findOne({"reset_token": token})

        if (!resetToken) {
            return res.json({ "resetStatus": false, "msg": "Invalid or Expired link" })
        }

        const upassword = await bcrypt.hash(user_password, 12)

        const resetPassword = await UserModel.findOneAndUpdate(
            { _id: resetToken.userId },
            { $set: { user_password: upassword } },
            { new: true }
        )

        await ResetPasswordModel.deleteMany({ "reset_token": token })

        res.json({ "resetStatus": true, "msg": "Your Password updated successfully." })
    } catch (error) {
        res.json({ "error": error })
    }
}