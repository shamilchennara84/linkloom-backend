import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { STATUS_CODES } from "../../constants/httpStatusCodes";

const userRepository = new UserRepository();
const { INTERNAL_SERVER_ERROR } = STATUS_CODES;

export const userRegisterValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const { username, email } = req.body;
    const isUsernameExist = await userRepository.findByUname(username)
    if (isUsernameExist) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ message: "Username already Exist" });
    }
    const isEmailExist = await userRepository.findByEmail(email)
    if (isEmailExist) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ message: "Email already Exist" });
    }
    next()


  } catch (error) {
    console.log(error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Not authorized, invalid token" });
  }
};
