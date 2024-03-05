// import { OTP_TIMER } from "../constants/constants";

import { log } from "console";
import * as fs from "fs";
import { MAX_OTP_TRY, OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperfunctions/response";
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { ITempUserReq, ITempUserRes } from "../interfaces/Schema/tempUserSchema";
import {
  IUser,
  IUserAuth,
  IUserSocialAuth,
  IApiUserAuthRes,
  IUsersAndCount,
  IUserUpdate,
  IApiUserRes,
  IUserRes,
} from "../interfaces/Schema/userSchema";
import { IapiResponse, ID } from "../interfaces/common";
import { MailSender } from "../providers/MailSender";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTtoken } from "../providers/jwtToken";
import path from "path";
import { IFollowCountRes, IFollowStatus, IFollowerReq, IUserSearchItem } from "../interfaces/Schema/followerSchema";

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
    const isUserExist = await this.userRepository.findByUname(username);
    return isUserExist;
  }

  async getUserData(userId: ID): Promise<IApiUserRes> {
    try {
      const user = await this.userRepository.getProfileData(userId);
      if (!user) return getErrorResponse(STATUS_CODES.BAD_REQUEST, "Invalid userId");
      return get200Response(user);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
  async saveTempUserDetails(userData: ITempUserReq): Promise<ITempUserRes & { userAuthToken: string }> {
    const user = await this.tempUserRepository.saveUser(userData);
    const userAuthToken = this.jwt.generateTempToken(user._id);
    return { ...JSON.parse(JSON.stringify(user)), userAuthToken };
  }

  async updateOtp(id: ID, OTP: number) {
    return await this.tempUserRepository.updateOtp(id, OTP);
  }
  async updateOtpTry(id: ID): Promise<boolean> {
    const updated = await this.tempUserRepository.updateOtpTries(id);
    if (updated) {
      return updated?.otpTries <= MAX_OTP_TRY ? true : false;
    }
    return false;
  }

  async findTempUserById(id: ID) {
    return await this.tempUserRepository.findById(id);
  }

  async saveUserDetails(userData: IUserAuth | IUserSocialAuth): Promise<IApiUserAuthRes> {
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

  async sendTimeoutOTP(id: ID, name: string, email: string, OTP: number) {
    try {
      this.mailer.sendOTP(email, name, OTP);
      setTimeout(async () => {
        await this.tempUserRepository.unsetOtp(id);
      }, OTP_TIMER);
    } catch (error) {
      console.log(error);
      throw Error("Error while sending timeout otp");
    }
  }

  async verifyLogin(email: string, password: string): Promise<IApiUserAuthRes> {
    const userData = await this.userRepository.findByEmail(email);
    if (userData !== null) {
      if (userData.isBlocked) {
        return {
          status: STATUS_CODES.FORBIDDEN,
          message: "you are blocked by admin",
          data: null,
          accessToken: "",
          refreshToken: "",
        };
      } else {
        const passwordMatch = await this.encrypt.comparePassword(password, userData.password as string);
        if (passwordMatch) {
          const accessToken = this.jwt.generateAccessToken(userData._id);
          console.log("accessToken", accessToken);
          const refreshToken = this.jwt.generateRefreshToken(userData._id);
          console.log("refreshToken", refreshToken);
          return {
            status: STATUS_CODES.OK,
            message: "Success",
            data: userData,
            accessToken,
            refreshToken,
          };
        } else {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            message: "Incorrect password",
            data: userData,
            accessToken: "",
            refreshToken: "",
          };
        }
      }
    }
    return {
      status: STATUS_CODES.NOT_FOUND,
      message: "invalid email or password",
      data: null,
      accessToken: "",
      refreshToken: "",
    };
  }

  async getAllUsers(
    page: number,
    limit: number,
    searchQuery: string | undefined
  ): Promise<IapiResponse<IUsersAndCount | null>> {
    try {
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const users = await this.userRepository.findAllUser(page, limit, searchQuery);
      const userCount = await this.userRepository.findUserCount(searchQuery);
      return get200Response({ users, userCount });
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async blockUser(userId: string) {
    try {
      await this.userRepository.blockUnblockUser(userId);
      return get200Response(null);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async updateUserData(userId: ID, user: IUserUpdate): Promise<IApiUserRes> {
    try {
      const updatedUser = await this.userRepository.updateUser(userId, user);
      return get200Response(updatedUser as IUserRes);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async updateUserProfilePic(userId: ID, fileName: string | undefined): Promise<IApiUserRes> {
    try {
      if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, "We didnt got the image, try again");
      log(userId, fileName, "userId, filename from use case");
      const user = await this.userRepository.findById(userId);
      // Deleting user dp if it already exist
      if (user && user.profilePic) {
        const filePath = path.join(__dirname, `../../images/${user.profilePic}`);
        fs.unlinkSync(filePath);
      }
      const updatedUser = await this.userRepository.updateUserProfilePic(userId, fileName);
      if (updatedUser) return get200Response(updatedUser);
      else return getErrorResponse(STATUS_CODES.BAD_REQUEST, "Invalid userId");
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async removeUserProfileDp(userId: ID): Promise<IApiUserRes> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) return getErrorResponse(STATUS_CODES.BAD_REQUEST, "Invalid userId");
      // Deleting user dp if it already exist
      if (user.profilePic) {
        const filePath = path.join(__dirname, `../../images/${user.profilePic}`);
        fs.unlinkSync(filePath);
      }
      const updatedUser = await this.userRepository.removeUserProfileDp(userId);
      if (updatedUser) {
        return get200Response(updatedUser);
      }

      return getErrorResponse(STATUS_CODES.BAD_REQUEST, "Invalid userId");
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async followUser(followData: IFollowerReq): Promise<IapiResponse<IFollowCountRes | null>> {
    try {
      const followersData = await this.userRepository.followUser(followData);
      if (!followersData) return getErrorResponse(STATUS_CODES.BAD_REQUEST, "Invalid userId");
      return get200Response({ count: followersData.count, status: followersData.status });
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async followStatus(userId: ID, followerId: ID): Promise<IapiResponse<IFollowStatus | null>> {
    try {
      const followStatusData = await this.userRepository.followStatus(userId, followerId);
      if (!followStatusData) {
        return getErrorResponse(STATUS_CODES.BAD_REQUEST, "Invalid userId or followerId");
      }
      return get200Response(followStatusData);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async unFollowUser(userId: ID, followerId: ID): Promise<IapiResponse<IFollowCountRes | null>> {
    try {
      const unfollowdata = await this.userRepository.unfollowUser(userId, followerId);
      if (!unfollowdata) return getErrorResponse(STATUS_CODES.BAD_REQUEST, "Invalid userId");
      return get200Response({ count: unfollowdata.count, status: unfollowdata.status });
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async userSearch(userId: ID, query: string): Promise<IapiResponse<IUserSearchItem[] | null>> {
    try {
      const usersData = await this.userRepository.searchUsers(userId, query);
      return get200Response(usersData);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
}
