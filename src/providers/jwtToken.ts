import jwt from "jsonwebtoken";
import { Jwt } from "../interfaces/jwt";
import { ID } from "../interfaces/common";
import {
  accessTokenExp,
  refreshTokenExp,
  tempTokenExp,
} from "../constants/constants";
import dotenv from "dotenv";
dotenv.config();


export class JWTtoken implements Jwt {
  generateAccessToken(userId: ID): string {
    const KEY = process.env.JWT_SECRET_KEY;
    console.log(KEY);
    if (KEY !== undefined) {
      const exp = Math.floor(Date.now() / 1000) + accessTokenExp;
      return jwt.sign({ userId, exp, iat: Date.now() / 1000 }, KEY);
    }
    throw new Error("JWT Key is not defined");
  }

  generateRefreshToken(userId: ID): string {
    const KEY = process.env.JWT_SECRET_KEY;
      console.log(KEY);
    if (KEY !== undefined) {
      const exp = Math.floor(Date.now() / 1000) + refreshTokenExp;
      return jwt.sign({ userId, exp, iat: Date.now() / 1000 }, KEY);
    }
    throw new Error("JWT Key is not defined");
  }

  generateTempToken(userId: ID): string {
    const KEY = process.env.JWT_SECRET_KEY;
      console.log(KEY);
    if (KEY !== undefined) {
      const exp = Math.floor(Date.now() / 1000) + tempTokenExp;
      return jwt.sign({ userId, exp, iat: Date.now() / 1000 }, KEY);
    }
    throw new Error("JWT Key is not defined");
  }
}
