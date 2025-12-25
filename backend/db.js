// const mongoose = require('mongoose');
// const uri="mongodb://nishthap1410:Nish%403305pandey@cluster1contesttracker.wgh4f3b.mongodb.net/"
// // const connectToMongo=async()=>{
// //     mongoose.connect(uri)
// // }
// mongoose.connect(uri)
//   .then(() => console.log("Database connected"))
//   .catch(err => console.log("Error in connecting to database", err))
// // module.exports=connectToMongo;


const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    console.log("Attempting to connect to MongoDB...");

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log("⚠️ Continuing without database connection (dev mode)");
  }
};

module.exports = connectDB;

