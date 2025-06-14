const mongoose = require('mongoose')

const LinkQRSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "user_mst",
        required: true
    },
    qrLink:{
        type: String,
        required: true
    },
    qrColor:{
        type: String,
        required: true
    },
    qr_status:{
        type: String,
        enum:['enable', 'disable'],
        default: 'enable'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("linkqr_mst", LinkQRSchema)