const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://anushsubedar007_db_user:A7j9209IFY9p25pO@inventory.ci3hnui.mongodb.net/?appName=Inventory");
  console.log("MongoDB Connected");
};

module.exports = connectDB;
