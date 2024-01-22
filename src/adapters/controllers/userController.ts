import { UserUseCase } from "../../useCases/userUseCase";
import { Encrypt } from "../../providers/bcryptPassword";
import { GenerateOTP } from "../../providers/otpGenerator";
import { MailSender } from "../../providers/nodemailer";
import { Request, Response, NextFunction } from "express";


export class UserController {
  constructor(
    private userUseCase: UserUseCase,
    private mailer: MailSender,
    private otpGenerator: GenerateOTP,
    private encrypt: Encrypt
  ) {}

  async userRegister(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      console.log(name, email, password);
      console.log(this, `this keyword logged`);
      const isEmailExist = await this.userUseCase.emailExist(email);
      if (!isEmailExist) {
        const OTP = this.otpGenerator.generateOTP();
        console.log(`sending mail `);
        this.mailer.sendMail(email, OTP);
        console.log(`otp is ${OTP}`);
        req.app.locals.OTP = OTP;
        const securePassword = await this.encrypt.encryptPassword(password);
        req.app.locals.userData = { name, email, password: securePassword };
        res.status(200).send();
      } else {
        throw new Error("Email already Exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async validateuserOTP(req: Request, res: Response) {
    try {
      console.log("validating otp");
      console.log(req.body.otp, "req.body.otp");
      console.log(req.app.locals.OTP, "req.app.locals.OTP");

      if (req.body.otp == req.app.locals.OTP) {
        await this.userUseCase.saveUserdetails(req.app.locals.userData);
        req.app.locals.userData = null;
        console.log("user details saved");
        res.status(200).send();
      } else {
        console.log("otp didnt match");
        res.status(400).json({ status: false, message: "Invalid OTP" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async resendOTP(req: Request, res: Response) {
    try {
      const OTP = this.otpGenerator.generateOTP();
      req.app.locals.OTP = OTP;

      this.mailer.sendMail(req.app.locals.userData.email, OTP);
      res.status(200).json({ message: "OTP has been send" });
    } catch (error) {
      console.log(error);
    }
  }

  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const verifiedData = await this.userUseCase.verifyLogin(email, password);
      if (verifiedData?.data.token !== "") {
        res.cookie("JWT", verifiedData?.data.token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,    //need more research on cookie and its setting xss,csrf
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("JWT", "", {
        httpOnly: true,
        expires: new Date(),
      });
    } catch (error) {
        next(error);
    }
  }
}
