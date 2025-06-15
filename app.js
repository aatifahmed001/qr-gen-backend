// require("dotenv").config()
// const express = require('express')
// const cors = require('cors')
// const bodyParser = require('body-parser')
// const db = require('./db')

// // const userModel = require('./Model/User')


// // All router will be here

// const userRouter = require('./Route/UserRoute')

// const app = express()
// app.use(bodyParser.json())
// app.use(cors());
// // app.use(cors({
// //     origin: 'http://localhost:3000'
// // }));

// // all router will initiate here
// app.use('/userapi', userRouter)

// const port = process.env.PORT

// app.listen(port, (req, res) =>{
//     console.log(`Server is running on: ${port}`)
// })

require("dotenv").config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./db')  // <- note the function import

const userRouter = require('./Route/UserRoute')

const app = express()
app.use(bodyParser.json())
app.use(cors())

// Connect to database before starting server
connectDB().then(() => {
    // all router will initiate here
    app.use('/userapi', userRouter)

    const port = process.env.PORT || 5000
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`)
    })
}).catch(err => {
    console.error("Failed to connect to DB:", err)
})

