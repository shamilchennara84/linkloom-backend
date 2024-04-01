"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const response_1 = require("../../helperFunctions/response");
class UserController {
    constructor(userUseCase, otpGenerator, encrypt) {
        this.userUseCase = userUseCase;
        this.otpGenerator = otpGenerator;
        this.encrypt = encrypt;
    }
    userRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullname, mobile, username, email, password } = req.body;
                const generatedOtp = this.otpGenerator.generateOTP();
                const securePassword = yield this.encrypt.encryptPassword(password);
                // Create temporary user object
                const tempUser = {
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
                const savedTempUser = yield this.userUseCase.saveTempUserDetails(tempUser);
                // Send OTP via email to the user for verification
                yield this.userUseCase.sendTimeoutOTP(savedTempUser._id, savedTempUser.fullname, savedTempUser.email, generatedOtp);
                return res.status(httpStatusCodes_1.STATUS_CODES.OK).json({ message: "Success", token: savedTempUser.userAuthToken });
            }
            catch (error) {
                console.error(error);
                res.status(httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
            }
        });
    }
    validateUserOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user property is present on the request object
                if (!req.user) {
                    return res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: "User not authenticated" });
                }
                const { otp } = req.body;
                // Directly use the user object from the request
                const user = req.user;
                if (otp == user.otp) {
                    // If OTP matches, save user data to the user collection
                    const savedData = yield this.userUseCase.saveUserDetails({
                        fullname: user.fullname,
                        username: user.username,
                        email: user.email,
                        mobile: user.mobile,
                        password: user.password,
                    });
                    return res.status(savedData.status).json(savedData);
                }
                else {
                    const tries = yield this.userUseCase.updateOtpTry(user._id);
                    if (!tries) {
                        return res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: `maximum try for OTP exceeded` });
                    }
                    return res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid OTP" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const authData = yield this.userUseCase.verifyLogin(email, password);
                res.status(authData.status).json(authData);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    userProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiResponse = yield this.userUseCase.getUserData(userId);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const userId = req.params.userId;
            const apiResponse = yield this.userUseCase.updateUserData(userId, user);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    updateUserProfileDp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = req.params.userId;
            const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
            const apiResponse = yield this.userUseCase.updateUserProfilePic(userId, fileName);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    removeUserProfileDp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiResponse = yield this.userUseCase.removeUserProfileDp(userId);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    followUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("backend called follow user");
            const userId = req.userid;
            const followerId = req.params.userId;
            const status = req.body.status;
            const followData = {
                followerUserId: userId,
                followingUserId: followerId,
                isApproved: true,
            };
            let apiResponse = (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "Invalid status");
            if (status === "Follow") {
                apiResponse = yield this.userUseCase.followUser(followData);
            }
            else if (status === "Request") {
                followData.isApproved = false;
                apiResponse = yield this.userUseCase.followUser(followData);
            }
            else if (status === "Following") {
                apiResponse = yield this.userUseCase.unFollowUser(userId, followerId);
            }
            console.log(apiResponse);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    getFollowStat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hello follow status");
            const userId = req.userid;
            const followerId = req.params.userId;
            const apiResponse = yield this.userUseCase.followStatus(userId, followerId);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    userSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = req.userid;
            const query = (_a = req.query) === null || _a === void 0 ? void 0 : _a.query;
            const apiResponse = yield this.userUseCase.userSearch(userId, query);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    getFollowerList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            console.log("controllerfollowerlist", userId);
            const apiResponse = yield this.userUseCase.userFollowersList(userId);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    getFollowingList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            console.log("controllerfollowinglist", userId);
            const apiResponse = yield this.userUseCase.userFollowingList(userId);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userid;
            const apiResponse = yield this.userUseCase.deleteUser(userId);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
}
exports.UserController = UserController;
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
