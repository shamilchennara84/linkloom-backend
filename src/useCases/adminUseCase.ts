// import { get200Response, get500Response } from "infrastructure/helperFunctions/response";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response } from "../infrastructure/helperFunctions/response";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";

import { IApiAdminAuthRes, IUserPerMonth, IUserPerYear } from "../interfaces/Schema/adminSchema";
import { IPostPerMonth } from "../interfaces/Schema/postSchema";
import { IAdminCardData } from "../interfaces/Schema/userSchema";
import { IApiResponse } from "../interfaces/common";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTtoken } from "../providers/jwtToken";

export class AdminUseCase {
  constructor(
    private readonly encrypt: Encrypt,
    private readonly adminRepository: AdminRepository,
    private readonly jwtToken: JWTtoken
  ) {}

  async verifyLogin(email: string, password: string): Promise<IApiAdminAuthRes> {
    const adminData = await this.adminRepository.findAdmin();
    if (adminData !== null) {
      const passwordMatch = await this.encrypt.comparePassword(password, adminData.password);
      if (passwordMatch) {
        const accessToken = this.jwtToken.generateAccessToken(adminData._id);
        const refreshToken = this.jwtToken.generateRefreshToken(adminData._id);
        return {
          status: STATUS_CODES.OK,
          message: "Success",
          data: adminData,
          accessToken,
          refreshToken,
        };
      } else {
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          message: "Invalid Email or Password",
          data: null,
          accessToken: "",
          refreshToken: "",
        };
      }
    } else {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        message: "Invalid Email or Password",
        data: null,
        accessToken: "",
        refreshToken: "",
      };
    }
  }

  async newUsersPerMonth(): Promise<IApiResponse<IUserPerMonth[] | null>> {
    try {
      const userData = await this.adminRepository.findUserPerMonth();
      return get200Response(userData);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async newUsersPerYear(): Promise<IApiResponse<IUserPerYear[] | null>> {
    try {
      const userData = await this.adminRepository.findUserPerYear();
      return get200Response(userData);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
  // async postmatrixPerYear() {
  //  try {
  //   const postData = await this.adminRepository.postPerYear();
  //   return get200Response(postData);
  //  } catch (error) {
  //   return get500Response(error as Error)
  //  }
  // }

  async postMatrixPerMonth(): Promise<IApiResponse<IPostPerMonth[] | null>> {
    try {
      const postData = await this.adminRepository.postPerMonth();
      return get200Response(postData);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async getIAdminCardData(): Promise<IApiResponse<IAdminCardData | null>> {
    try {
      const cardData = await this.adminRepository.getCardData();
      return get200Response(cardData);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
}
