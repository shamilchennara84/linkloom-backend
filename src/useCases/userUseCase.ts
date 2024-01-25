import { OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import {
  ITempUserReq,
  ITempUserRes,
} from "../interfaces/Schema/tempUserSchema";
import {
  IUser,
  IUserAuth,
  IUserSocialAuth,
  IApiUserAuthRes,
} from "../interfaces/Schema/userSchema";
import { ID } from "../interfaces/common";
import { MailSender } from "../providers/MailSender";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTtoken } from "../providers/jwtToken";

export class UserUseCase {
  constructor(
    private readonly encrypt: Encrypt,
    private readonly JWTtoken: JWTtoken,
    private readonly userRepository: UserRepository,
    private readonly tempUserRepository: TempUserRepository,
    private readonly mailer: MailSender
  ) {}

  async isEmailExist(email: string): Promise<IUser | null> {
    const isUserExist = await this.userRepository.findByEmail(email);
    return isUserExist;
  }
  async isUsernameExist(username: string): Promise<IUser | null> {
    const isUserExist = await this.userRepository.findByUname(username);
    return isUserExist;
  }

  async saveTempUserDetails(
    userData: ITempUserReq
  ): Promise<ITempUserRes & { userAuthToken: string }> {
    const user = await this.tempUserRepository.saveUser(userData);
    const userAuthToken = this.JWTtoken.generateTempToken(user._id);
    return { ...JSON.parse(JSON.stringify(user)), userAuthToken };
  }

  async sendTimeoutOTP(id: ID,name:string, email: string, OTP: number) {
    try {
      this.mailer.sendOTP(email,name,OTP);

        setTimeout(async () => {
          await this.tempUserRepository.unsetOtp(id, email);
        }, OTP_TIMER);
    } catch (error) {
      console.log(error);
      throw Error('error while sending timeout OTP')
    }
  }

  async saveUserDetails(
    userData: IUserAuth | IUserSocialAuth
  ): Promise<IApiUserAuthRes> {
    const user = await this.userRepository.saveUser(userData);
    console.log("user data saved, on usecase", user);
    const accessToken = this.JWTtoken.generateAccessToken(user._id);
    const refreshToken = this.JWTtoken.generateRefreshToken(user._id);
    return {
      status: STATUS_CODES.OK,
      data: user,
      message: "Success",
      accessToken,
      refreshToken,
    };
  }

  // async verifyLogin(email: string, password: string) {
  //   const userData = await this.userRepository.findByEmail(email);
  //   if (userData !== null) {
  //     if (userData.isBlocked) {
  //       throw new Error("You are blocked by admin");
  //     } else {
  //       const passwordMatch = await this.encrypt.comparePassword(
  //         password,
  //         userData.password as string
  //       );
  //       if (passwordMatch) {
  //         const token = this.JWTtoken.generateToken(userData._id);
  //         return {
  //           status: 200,
  //           data: { userData, token },
  //         };
  //       }
  //     }
  //   } else {
  //     throw new Error("invalid email or password");
  //   }
}
