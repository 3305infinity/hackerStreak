const mongoose = require('mongoose');
const uri="mongodb+srv://nishthap1410:4UYo53zLyey3d6cq@cluster1contesttracker.wgh4f3b.mongodb.net/"
// const connectToMongo=async()=>{
//     mongoose.connect(uri)
// }
mongoose.connect(uri)
  .then(() => console.log("Database connected"))
  .catch(err => console.log("Error in connecting to database", err))
// module.exports=connectToMongo;