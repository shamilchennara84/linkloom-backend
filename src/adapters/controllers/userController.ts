import { UserUseCase } from "../../useCases/userUseCase";
import { Encrypt } from "../../providers/bcryptPassword";
import { GenerateOTP } from "../../providers/otpGenerator";
import { IUserAuth, IUserUpdate } from "../../interfaces/Schema/userSchema";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ITempUserReq } from "../../interfaces/Schema/tempUserSchema";
import { IApiResponse, ID } from "../../interfaces/common";
import { Request, Response } from "express-serve-static-core";
import { RequestWithTempUser } from "../../infrastructure/middleware/validateTokenAndTempUser.ts";

import { RequestWithUser } from "../../infrastructure/middleware/userAuth";
import { IFollowCountRes, IFollowerReq } from "../../interfaces/Schema/followerSchema";
import * as response from "../../infrastructure/helperFunctions/response";

export class UserController {
  constructor(private userUseCase: UserUseCase, private otpGenerator: GenerateOTP, private encrypt: Encrypt) {}

  async userRegister(req: Request, res: Response) {
    try {
      const { fullname, mobile, username, email, password } = req.body as IUserAuth;

      const generatedOtp = this.otpGenerator.generateOTP();
      const securePassword = await this.encrypt.encryptPassword(password);
      // Create temporary user object
      const tempUser: ITempUserReq = {
        fullname,
        username,
        email,
        mobile,
        password: securePassword,
        otp: generatedOtp,
        otpTries: 0,
        otpExpiresAt: new Date(Date.now() + 3 * 60 * 1000),
      };

      // Save temporary user data during the registration process
      const savedTempUser = await this.userUseCase.saveTempUserDetails(tempUser);
      // Send OTP via email to the user for verification

      await this.userUseCase.sendTimeoutOTP(
        savedTempUser._id,
        savedTempUser.fullname,
        savedTempUser.email,
        generatedOtp
      );

      return res.status(STATUS_CODES.OK).json({ message: "Success", token: savedTempUser.userAuthToken });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }

  async validateUserOTP(req: RequestWithTempUser, res: Response) {
    try {
      // Check if the user property is present on the request object
      if (!req.user) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "User not authenticated" });
      }

      const { otp } = req.body;

      // Directly use the user object from the request
      const user = req.user;

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
        const tries = await this.userUseCase.updateOtpTry(user._id);
        if (!tries) {
          return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: `maximum try for OTP exceeded` });
        }

        return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async userLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const authData = await this.userUseCase.verifyLogin(email, password);
      res.status(authData.status).json(authData);
    } catch (error) {
      console.log(error);
    }
  }

  async userProfile(req: Request, res: Response) {
    const userId = req.params.userId as unknown as ID;
    const apiResponse = await this.userUseCase.getUserData(userId);
    res.status(apiResponse.status).json(apiResponse);
  }

  async updateProfile(req: Request, res: Response) {
    const user = req.body as IUserUpdate;
    const userId: ID = req.params.userId as unknown as ID;
    const apiResponse = await this.userUseCase.updateUserData(userId, user);
    res.status(apiResponse.status).json(apiResponse);
  }

  async updateUserProfileDp(req: Request, res: Response) {
    const userId: ID = req.params.userId as unknown as ID;
    const fileName = req.file?.filename;
    const apiResponse = await this.userUseCase.updateUserProfilePic(userId, fileName);
    res.status(apiResponse.status).json(apiResponse);
  }

  async removeUserProfileDp(req: Request, res: Response) {
    const userId: ID = req.params.userId as unknown as ID;
    const apiResponse = await this.userUseCase.removeUserProfileDp(userId);
    res.status(apiResponse.status).json(apiResponse);
  }

  async followUser(req: RequestWithUser, res: Response) {
    console.log("backend called follow user");
    const userId = req.userid as ID;
    const followerId = req.params.userId as unknown as ID;
    const status = req.body.status;
    const followData: IFollowerReq = {
      followerUserId: userId,
      followingUserId: followerId,
      isApproved: true,
    };
    let apiResponse: IApiResponse<IFollowCountRes | null> = response.getErrorResponse(
      STATUS_CODES.BAD_REQUEST,
      "Invalid status"
    );
    if (status === "Follow") {
      apiResponse = await this.userUseCase.followUser(followData);
    } else if (status === "Request") {
      followData.isApproved = false;
      apiResponse = await this.userUseCase.followUser(followData);
    } else if (status === "Following") {
      apiResponse = await this.userUseCase.unFollowUser(userId, followerId);
    }
    console.log(apiResponse);
    res.status(apiResponse.status).json(apiResponse);
  }

  async getFollowStat(req: RequestWithUser, res: Response) {
    console.log("hello follow status");
    const userId = req.userid as ID;
    const followerId = req.params.userId as unknown as ID;

    const apiResponse = await this.userUseCase.followStatus(userId, followerId);

    res.status(apiResponse.status).json(apiResponse);
  }

  async userSearch(req: RequestWithUser, res: Response) {
    const userId = req.userid as ID;
    const query = req.query?.query as string;
    const apiResponse = await this.userUseCase.userSearch(userId, query);
    res.status(apiResponse.status).json(apiResponse);
  }
  async getFollowerList(req: Request, res: Response) {
    const userId = req.params.userId as unknown as string;
    console.log("controllerfollowerlist", userId);
    const apiResponse = await this.userUseCase.userFollowersList(userId);
    res.status(apiResponse.status).json(apiResponse);
  }

  async getFollowingList(req: Request, res: Response) {
    const userId = req.params.userId as unknown as string;
    console.log("controllerfollowinglist", userId);
    const apiResponse = await this.userUseCase.userFollowingList(userId);
    res.status(apiResponse.status).json(apiResponse);
  }

  async deleteUser(req: RequestWithUser, res: Response) {
    const userId = req.userid as unknown as string;
    const apiResponse = await this.userUseCase.deleteUser(userId);
    res.status(apiResponse.status).json(apiResponse);
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
