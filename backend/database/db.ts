import mongoose from "mongoose";
const dotenv = require("dotenv");
dotenv.config();

const CONNECTION_STRING: any = process.env.CONNECTION_STRING;

const DBConnection = async () => {
  try {
    mongoose.connect(CONNECTION_STRING);
    console.log("DB Connection Established");
  } catch (error) {
    console.log("error while connecting to mongodb ", error);
  }
};

module.exports = { DBConnection };
