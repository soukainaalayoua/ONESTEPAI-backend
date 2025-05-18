const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("database connected succfuly");
  } catch (error) {
    console.log("error to connected database", error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
