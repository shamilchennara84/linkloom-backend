import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { TempUserRepository } from "../repositories/tempUserRepository";
import { ITempUserRes } from "../../interfaces/Schema/tempUserSchema";

export interface RequestWithUser extends Request {
  user?: ITempUserRes;
}

const tempUserRepository = new TempUserRepository();

export const validateTokenAndTempUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "authToken missing, Register again" });
    }

    const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload;
    const user = await tempUserRepository.findById(decoded.userId);

    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Timeout, Register again" });
    }

    // Attach the user object to the request
    req["user"] = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in validateTokenAndTempUser middleware:", error);
    res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid token or user" });
  }
};