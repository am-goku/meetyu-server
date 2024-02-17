import mongoose, { mongo } from "mongoose";

import dotenv from "dotenv";

dotenv.config();


const MONGO_URI = process.env.DB_URI;
const PASSWORD = process.env.DB_URI_PASSWORD;
const DB_NAME = process.env.DB_NAME;

let DB_URI = MONGO_URI.replace("${PASSWORD}", PASSWORD).replace("${DB_NAME}", DB_NAME);


function connect_db () {
    try {
        mongoose
          .connect(DB_URI)
          .then(() => {
            console.log("Database has been connected.");
          })
          .catch((err) => {
            console.log("Error connecting to Database", err);
          });
    } catch (error) {
        console.log("Error connecting to Database", error);
    }
}

export default connect_db