import { UserUseCase } from "../../useCases/userUseCase";
import { Encrypt } from "../../providers/bcryptPassword";
import { GenerateOTP } from "../../providers/otpGenerator";
import { MailSender } from "../../providers/MailSender";
import { Request, Response } from "express";
import { IUserAuth } from "../../interfaces/Schema/userSchema";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ITempUserReq } from "../../interfaces/Schema/tempUserSchema";
import jwt, { JwtPayload } from "jsonwebtoken";

export class UserController {
  constructor(
    private userUseCase: UserUseCase,
    private mailer: MailSender,
    private otpGenerator: GenerateOTP,
    private encrypt: Encrypt
  ) {}

  async userRegister(req: Request, res: Response) {
    try {
      const { fullname, mobile, username, email, password } = req.body as IUserAuth;


      const isUsernameExist = await this.userUseCase.isUsernameExist(username);
      if (isUsernameExist) {
        return res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: "Username already Exist" });
      }
      const isEmailExist = await this.userUseCase.isEmailExist(email);
      if (isEmailExist) {
        return res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: "Email already Exist" });
      }

      // Generate OTP for user authentication and encrypt the user's password
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
        otpTries: 0,
        otpExpiresAt: new Date(Date.now() + 3 * 60 * 1000),
      };
      // Save temporary user data during the registration process
      const tempUser = await this.userUseCase.saveTempUserDetails(user);

      // Send OTP via email to the user for verification
      await this.userUseCase.sendTimeoutOTP(
        tempUser._id,
        tempUser.fullname,
        tempUser.email,
        OTP
      );
      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Success", token: tempUser.userAuthToken });
    } catch (error) {
      console.error(error);
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  }

  async validateUserOTP(req: Request, res: Response) {
    try {
      const { otp } = req.body;
      const authToken = req.headers.authorization;

      // Obtaining a temporary access token and fetching user information
      if (authToken) {
        const decoded = jwt.verify(
          authToken.slice(7),
          process.env.JWT_SECRET_KEY as string
        ) as JwtPayload;
        console.log("decoded", decoded);
        const user = await this.userUseCase.findTempUserById(decoded.userId);
        if (user) {
          console.log(otp, user.otp);
          if (otp == user.otp) {
            // If OTP matches, save user data to the user collection
            const savedData = await this.userUseCase.saveUserDetails({
              fullname: user.fullname,
              username: user.username,
              email: user.email,
              mobile: user.mobile,
              password: user.password,
            });
            return res.status(savedData.status).json(savedData);
          } else {
            const tries = await this.userUseCase.updateOtpTry(decoded.userId);
            if (!tries) {
              return res
                .status(STATUS_CODES.UNAUTHORIZED)
                .json({ message: `maximum try for OTP exceeded` });
            }
            console.log("otp didnt match");
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid OTP" });
          }
        } else {
          return res
            .status(STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Timeout, Register again" });
        }
      } else {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: "authToken missing, Register again" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async userLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const authData = await this.userUseCase.verifyLogin(email, password );
      res.status(authData.status).json(authData)
    } catch (error) {
      console.log(error);
    }
  }
















  // async resendOTP(req: Request, res: Response) {
  //   try {
  //     const authToken = req.headers.authorization;
  //     if (authToken) {
  //       const decode = jwt.verify(
  //         authToken.slice(7),
  //         process.env.JWT_SECRET_KEY as string
  //       ) as JwtPayload;
  //       const tempUser = await this.userUseCase.findTempUserById(decode.id);
  //       if (tempUser) {
  //         const OTP = this.otpGenerator.generateOTP();
  //         console.log(OTP, "new resend otp");
  //         await this.userUseCase.sendmailOTP(
  //           tempUser._id,
  //           tempUser.fullname,
  //           tempUser.email,
  //           OTP
  //         );
  //         res.status(STATUS_CODES.OK).json({ message: "OTP has been sent" });
  //       } else {
  //         res
  //           .status(STATUS_CODES.UNAUTHORIZED)
  //           .json({ message: "user timeout, register again" });
  //       }
  //     } else {
  //       res
  //         .status(STATUS_CODES.UNAUTHORIZED)
  //         .json({ message: "AuthToken missing" });
  //     }
  //     console.log("OTP resent successfully");
  //     res.status(200).json({ message: "OTP has been sent" });
  //   } catch (error) {
  //     console.error("Error while resending OTP:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }


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
