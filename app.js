require("dotenv").config()
const express = require('express')
const cors = require('cors')
const boyParsor = require('body-parser')
const db = require('./db')

// const userModel = require('./Model/User')


// All router will be here

const userRouter = require('./Route/UserRoute')

const app = express()
app.use(boyParsor.json())
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000'
// }));

// all router will initiate here
app.use('/userapi', userRouter)

const port = process.env.PORT

app.listen(port, (req, res) =>{
    console.log(`Server is running on: ${port}`)
})
