import express from "express";
import { UserController } from "../../adapters/controllers/userController";
import { UserUseCase } from "../../useCases/userUseCase";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOTP } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";
import { JWTtoken } from "../../providers/jwtToken";
import { UserRepository } from "../repositories/userRepository";

const userRouter = express.Router();

const userRepository = new UserRepository();
const jwttoken = new JWTtoken();
const encrypt = new Encrypt();
const otpGenerator = new GenerateOTP();
const mailSender = new MailSender();
const userUseCase = new UserUseCase(encrypt, jwttoken, userRepository);
const uController = new UserController(userUseCase, mailSender, otpGenerator, encrypt);

userRouter.post("/register", (req, res) => uController.userRegister(req, res));
userRouter.post("/validateOtp", (req, res) => uController.validateuserOTP(req, res));
userRouter.post("/resendOtp", uController.resendOTP);
userRouter.post("/login", uController.userLogin);
userRouter.post("/logout", uController.logout);

export default userRouter;
