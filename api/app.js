// require("dotenv").config()
// const express = require('express')
// const cors = require('cors')
// const bodyParser = require('body-parser')
// const serverless = require('serverless-http')
// const db = require('../db')

// // const userModel = require('./Model/User')


// // All router will be here
// const userRouter = require('../Route/UserRoute')

// const app = express()
// app.use(bodyParser.json())
// app.use(cors());
// // app.use(cors({
// //     origin: 'http://localhost:3000'
// // }));

// // all router will initiate here
// app.use('/userapi', userRouter)

// module.exports = app
// module.exports.handler = serverless(app)


// require("dotenv").config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const serverless = require('serverless-http');
// const connectToDB = require('../db');
// const userRouter = require('../Route/UserRoute');

// const app = express();

// app.use(bodyParser.json());
// app.use(cors());
// app.use('/userapi', userRouter);

// // Ensuring DB is connected before exporting handler
// let serverlessHandler;

// async function setup() {
//     await connectToDB(); // ⬅️ wait for DB connection before exporting
//     serverlessHandler = serverless(app);
// }

// setup();

// module.exports.handler = async (req, res) => {
//     if (!serverlessHandler) {
//         res.statusCode = 503;
//         res.end('Server is starting up...');
//         return;
//     }
//     return serverlessHandler(req, res);
// };

require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const connectToDB = require('../db');
const userRouter = require('../Route/UserRoute');

const app = express();

app.use(cors({
  origin: 'https://ultimate-qr-gen-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use('/', userRouter);

// Connect to DB and cache connection promise
const dbConnectPromise = connectToDB();

const serverlessHandler = serverless(app);

module.exports.handler = async (req, res) => {
  try {
    // Await DB connection before handling request
    await dbConnectPromise;
    return serverlessHandler(req, res);
  } catch (error) {
    console.error("DB connection error:", error);
    res.statusCode = 500;
    res.end('Database connection error');
  }
};

