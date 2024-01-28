
// import { OTP_TIMER } from "../constants/constants";
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
    private readonly jwt: JWTtoken,
    private readonly userRepository: UserRepository,
    private readonly tempUserRepository: TempUserRepository,
    private readonly mailer: MailSender
  ) {}

  async isEmailExist(email: string): Promise<IUser | null> {
    const isUserExist = await this.userRepository.findByEmail(email);
    return isUserExist;
  }
  async isUsernameExist(username: string): Promise<IUser | null> {
    const isUserExist = await this.userRepository.findByUname(username)
    return isUserExist
  }

  async saveTempUserDetails(
    userData: ITempUserReq
  ): Promise<ITempUserRes & { userAuthToken: string }> {
    const user = await this.tempUserRepository.saveUser(userData);
    console.log(userData,user);
    const userAuthToken = this.jwt.generateTempToken(user._id);
    return { ...JSON.parse(JSON.stringify(user)), userAuthToken };
  }

  async updateOtp(id: ID, OTP: number) {
    return await this.tempUserRepository.updateOtp(id, OTP);
  }

  async findTempUserById(id: ID) {
    return await this.tempUserRepository.findById(id);
  }

  async saveUserDetails(
    userData: IUserAuth | IUserSocialAuth
  ): Promise<IApiUserAuthRes> {
    const user = await this.userRepository.saveUser(userData);
    console.log("user data saved, on usecase", user);
    const accessToken = this.jwt.generateAccessToken(user._id);
    const refreshToken = this.jwt.generateRefreshToken(user._id);
    return {
      status: STATUS_CODES.OK,
      data: user,
      message: "Success",
      accessToken,
      refreshToken,
    };
  }

  sendTimeoutOTP(id:ID,name:string,email:string,OTP:number){
    try {
      this.mailer.sendOTP(email,name, OTP)
                    
            // setTimeout(async() => {
            //     await this.tempUserRepository.unsetOtp(id)
            // }, OTP_TIMER)
    } catch (error) {
      console.log(error);
            throw Error('Error while sending timeout otp')
    }
  }

  
}
