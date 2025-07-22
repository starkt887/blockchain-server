// require("dotenv").config();
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import { PORT } from "./constants.js";
dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`All good and Working!!${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed!!:", error);
  });
