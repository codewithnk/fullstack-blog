import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/app.js";

dotenv.config();

// const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen( () => console.log(`Server running `));
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });
