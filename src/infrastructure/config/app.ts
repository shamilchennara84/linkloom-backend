import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import adminRouter from "../router/adminRouter";
import userRouter from "../router/userRouter";
import tokenRouter from "../router/tokenRouter";
import { postUseCase } from "../../providers/controllers"; 
import cron from 'node-cron';

export const createServer = () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/images", express.static(path.join(__dirname, "../../../images")));

    app.use(
      cors({
        credentials: true,
        origin: process.env.CORS_URI,
      })
    );

    cron.schedule("* * * * *", () => {
      postUseCase
        .PostRemovalJob()
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error(error);
        });
    });
      
    app.use("/api/admin", adminRouter);
    app.use("/api/user", userRouter);
    app.use("/api/token", tokenRouter);

    return app;
  } catch (error) {
    const err: Error = error as Error;
    console.log(err.message);
  }
};


