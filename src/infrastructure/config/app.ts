import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import adminRouter from "../router/adminRouter";
import userRouter from "../router/userRouter";

export const createServer = () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "../public")));

    app.use(cookieParser())

    app.use(
      cors({
        credentials: true,
        origin: process.env.CORS_URI,
      })
    );

    app.use("/api/admin", adminRouter);
    app.use("/api/user", userRouter);
    return app;
  } catch (error) {
    const err: Error = error as Error;
    console.log(err.message);
  }
};


