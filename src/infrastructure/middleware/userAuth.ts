import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ID } from "../../interfaces/common";


export interface RequestWithUser extends Request {
  userid?: ID;
}
const userRepository = new UserRepository();
const { FORBIDDEN, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = STATUS_CODES;

export const userAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    console.log("userAuth router");
    const token = req.headers.authorization;
    if (token) {
      const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload;
     
      const userData = await userRepository.findById(decoded.userId);

    // console.log(userData);
      if (userData !== null) {
        if (userData.isBlocked) {
          res.status(FORBIDDEN).json({ message: "You are blocked" });
        } else {
          req["userid"] = userData._id;
          next();
        }
      } else {
        res.status(UNAUTHORIZED).json({ message: "Not authorized, invalid token" });
      }
    } else {
      res.status(UNAUTHORIZED).json({ message: "Token not available" });
    }
  } catch (error) {
    console.log(error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Not authorized, invalid token" });
  }
};
