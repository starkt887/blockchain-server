import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import userRoutes from "./routes/user.routes.js";
import { asyncHandler } from "./utils/asyncHandler.js";
//initialize routes
app.use("/api/v1/users", userRoutes);

app.get(
  "/servercheck",
  asyncHandler((req, res) => {
    res.status(200).json({
      message: "Server OK!",
      status: 200,
    });
  })
);
export { app };
