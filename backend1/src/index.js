// require('dotenv').config()
import { configDotenv } from "dotenv";
configDotenv();
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import connectDB from "./db/dbase.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `server is running on http://localhost:${process.env.PORT || 8000}`
      );
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed", err);
  });

/*
import express from "express";
async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR:", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`serve at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);  
    throw error;
  }
};

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.json("backend running");
});
*/
