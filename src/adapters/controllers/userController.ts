import { UserUseCase } from "../../useCases/userUseCase";
import { Encrypt } from "../../providers/bcryptPassword";
import { GenerateOTP } from "../../providers/otpGenerator";
import { MailSender } from "../../providers/MailSender";
// import { Request, Response, NextFunction } from "express";
import { Request, Response } from "express";
import { IUserAuth } from "../../interfaces/Schema/userSchema";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ITempUserReq } from "../../interfaces/Schema/tempUserSchema";

export class UserController {
  constructor(
    private userUseCase: UserUseCase,
    private mailer: MailSender,
    private otpGenerator: GenerateOTP,
    private encrypt: Encrypt
  ) {}

  async userRegister(req: Request, res: Response) {
    try {
      const { fullname, mobile, username, email, password } =
        req.body as IUserAuth;
      const isUsernameExist = await this.userUseCase.isUsernameExist(username);
      if (isUsernameExist) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: "Username already Exist" });
      }
      const isEmailExist = await this.userUseCase.isEmailExist(email);
      if (isEmailExist) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: "Email already Exist" });
      }
      const OTP = this.otpGenerator.generateOTP();
      console.log(`OTP is ${OTP}`);
      const securePassword = await this.encrypt.encryptPassword(password);
      const user: ITempUserReq = {
        fullname,
        username,
        email,
        mobile,
        password: securePassword,
        otp: OTP,
      };

      const tempUser = await this.userUseCase.saveTempUserDetails(user);

      this.userUseCase.sendTimeoutOTP(tempUser._id,tempUser.fullname,tempUser.email,OTP)
      res
        .status(STATUS_CODES.OK)
        .json({ message: "Success", token: tempUser.userAuthToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //   async validateUserOTP(req: Request, res: Response) {
  //     try {
  //       console.log("Validating OTP");
  //       const userProvidedOTP = req.body.otp;
  //       const storedOTP = req.app.locals.OTP;

  //       if (userProvidedOTP === storedOTP) {
  //         const newUser = await this.userUseCase.saveUserDetails(req.app.locals.userData);
  //         console.log("User saved:", newUser);
  //         req.app.locals.userData = null;
  //         console.log("User details saved successfully");
  //         res.status(200).send();
  //       } else {
  //         console.log("OTP didn't match");
  //         res.status(400).json({ status: false, message: "Invalid OTP" });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ error: "Internal server error" });
  //     }
  //   }

  //   async resendOTP(req: Request, res: Response) {
  //     try {
  //       const newOTP = this.otpGenerator.generateOTP();
  //       req.app.locals.OTP = newOTP;

  //       const { email, fullname } = req.app.locals.userData;

  //       this.mailer.sendMail(email, fullname, newOTP);
  //       console.log("OTP resent successfully");
  //       res.status(200).json({ message: "OTP has been sent" });
  //     } catch (error) {
  //       console.error("Error while resending OTP:", error);
  //       res.status(500).json({ error: "Internal server error" });
  //     }
  //   }

  //   async userLogin(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { email, password } = req.body;
  //       const verifiedData = await this.userUseCase.verifyLogin(email, password);
  //       if (verifiedData?.data.token !== "") {
  //         res.cookie("JWT", verifiedData?.data.token, {
  //           httpOnly: true,
  //           sameSite: "strict",
  //           maxAge: 30 * 24 * 60 * 60 * 1000,
  //         });
  //       }
  //     } catch (error) {
  //       next(error);
  //     }
  //   }

  //   async logout(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       res.cookie("JWT", "", {
  //         httpOnly: true,
  //         expires: new Date(0),
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // }
}
