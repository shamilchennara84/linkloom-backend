import express from "express";
import { UserController } from "../../adapters/controllers/userController";
import { UserUseCase } from "../../useCases/userUseCase";
import { MailSender } from "../../providers/MailSender";
import { GenerateOTP } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";
import { JWTtoken } from "../../providers/jwtToken";
import { UserRepository } from "../repositories/userRepository";
import { TempUserRepository } from "../repositories/tempUserRepository";


const userRouter = express.Router();

const userRepository = new UserRepository();
const tempUserRepository = new TempUserRepository()
const jwttoken = new JWTtoken();
const encrypt = new Encrypt();
const otpGenerator = new GenerateOTP();
const mailSender = new MailSender();
const userUseCase = new UserUseCase(encrypt, jwttoken, userRepository,tempUserRepository,mailSender);
const uController = new UserController(userUseCase, mailSender, otpGenerator, encrypt);

userRouter.post("/register", uController.userRegister.bind(uController));
userRouter.post("/validateOtp", uController.validateUserOTP.bind(uController));
// userRouter.post("/resendOtp", uController.resendOTP);
// userRouter.post("/login", uController.userLogin);
// userRouter.post("/logout", uController.logout);

export default userRouter;
