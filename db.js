// require('dotenv').config()
// const mongoose = require('mongoose')

// mongoose.connect(process.env.DB_URL)

// mongoose.connection.on('connected', ()=>{
//     console.log('MongoDB Connected.')
// })

// mongoose.connection.on('error',(error)=>{
//     console.log('Error is', error)
// })

// module.exports = mongoose


// require('dotenv').config();
// const mongoose = require('mongoose');

// const connectToDB = async () => {
//     try {
//         console.log("Connecting to MongoDB with URI:", process.env.DB_URL);
//         await mongoose.connect(process.env.DB_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log('MongoDB Connected.');
//     } catch (error) {
//         console.error('MongoDB Connection Error:', error);
//         throw error; // important for fail-fast
//     }
// };

// module.exports = connectToDB;

require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;

