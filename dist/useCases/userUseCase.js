"use strict";
// import { OTP_TIMER } from "../constants/constants";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
const console_1 = require("console");
const fs = __importStar(require("fs"));
const constants_1 = require("../constants/constants");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../helperFunctions/response");
const path_1 = __importDefault(require("path"));
class UserUseCase {
    constructor(encrypt, jwt, userRepository, tempUserRepository, mailer) {
        this.encrypt = encrypt;
        this.jwt = jwt;
        this.userRepository = userRepository;
        this.tempUserRepository = tempUserRepository;
        this.mailer = mailer;
    }
    isEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield this.userRepository.findByEmail(email);
            return isUserExist;
        });
    }
    isUsernameExist(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield this.userRepository.findByUname(username);
            return isUserExist;
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getProfileData(userId);
                if (!user)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "Invalid userId");
                return (0, response_1.get200Response)(user);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    saveTempUserDetails(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.tempUserRepository.saveUser(userData);
            const userAuthToken = this.jwt.generateTempToken(user._id);
            return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(user))), { userAuthToken });
        });
    }
    updateOtp(id, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tempUserRepository.updateOtp(id, OTP);
        });
    }
    updateOtpTry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.tempUserRepository.updateOtpTries(id);
            if (updated) {
                return (updated === null || updated === void 0 ? void 0 : updated.otpTries) <= constants_1.MAX_OTP_TRY ? true : false;
            }
            return false;
        });
    }
    findTempUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tempUserRepository.findById(id);
        });
    }
    saveUserDetails(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.saveUser(userData);
            const accessToken = this.jwt.generateAccessToken(user._id);
            const refreshToken = this.jwt.generateRefreshToken(user._id);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: user,
                message: "Success",
                accessToken,
                refreshToken,
            };
        });
    }
    sendTimeoutOTP(id, name, email, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.mailer.sendOTP(email, name, OTP);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.tempUserRepository.unsetOtp(id);
                }), constants_1.OTP_TIMER);
            }
            catch (error) {
                console.log(error);
                throw Error("Error while sending timeout otp");
            }
        });
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.userRepository.findByEmail(email);
            if (userData !== null) {
                if (userData.isBlocked) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.FORBIDDEN,
                        message: "you are blocked by admin",
                        data: null,
                        accessToken: "",
                        refreshToken: "",
                    };
                }
                else if (userData.isDeleted) {
                    // Check if the user is deleted
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.FORBIDDEN,
                        message: "Contact admin to recover account",
                        data: null,
                        accessToken: "",
                        refreshToken: "",
                    };
                }
                else {
                    const passwordMatch = yield this.encrypt.comparePassword(password, userData.password);
                    if (passwordMatch) {
                        const accessToken = this.jwt.generateAccessToken(userData._id);
                        const refreshToken = this.jwt.generateRefreshToken(userData._id);
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.OK,
                            message: "Success",
                            data: userData,
                            accessToken,
                            refreshToken,
                        };
                    }
                    else {
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                            message: "Incorrect password",
                            data: userData,
                            accessToken: "",
                            refreshToken: "",
                        };
                    }
                }
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.NOT_FOUND,
                message: "invalid email or password",
                data: null,
                accessToken: "",
                refreshToken: "",
            };
        });
    }
    getAllUsers(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!searchQuery)
                    searchQuery = "";
                const users = yield this.userRepository.findAllUser(page, limit, searchQuery);
                const userCount = yield this.userRepository.findUserCount(searchQuery);
                return (0, response_1.get200Response)({ users, userCount });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getPostReports(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!searchQuery)
                    searchQuery = "";
                const reports = yield this.userRepository.getAllReportWithStatus(page, limit, searchQuery);
                console.log(reports);
                const reportCount = yield this.userRepository.findReportCount(searchQuery);
                return (0, response_1.get200Response)({ reports, reportCount });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.blockUnblockUser(userId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    resolveReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield this.userRepository.resolveReport(reportId);
                return (0, response_1.get200Response)(report);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateUserData(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.userRepository.updateUser(userId, user);
                return (0, response_1.get200Response)(updatedUser);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateUserProfilePic(userId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileName)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "We didnt got the image, try again");
                (0, console_1.log)(userId, fileName, "userId, filename from use case");
                const user = yield this.userRepository.findById(userId);
                // Deleting user dp if it already exist
                if (user && user.profilePic) {
                    const filePath = path_1.default.join(__dirname, `../../images/${user.profilePic}`);
                    fs.unlinkSync(filePath);
                }
                const updatedUser = yield this.userRepository.updateUserProfilePic(userId, fileName);
                if (updatedUser)
                    return (0, response_1.get200Response)(updatedUser);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "Invalid userId");
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    removeUserProfileDp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "Invalid userId");
                // Deleting user dp if it already exist
                if (user.profilePic) {
                    const filePath = path_1.default.join(__dirname, `../../images/${user.profilePic}`);
                    fs.unlinkSync(filePath);
                }
                const updatedUser = yield this.userRepository.removeUserProfileDp(userId);
                if (updatedUser) {
                    return (0, response_1.get200Response)(updatedUser);
                }
                return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "Invalid userId");
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    followUser(followData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followersData = yield this.userRepository.followUser(followData);
                if (!followersData)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "Invalid userId");
                return (0, response_1.get200Response)({ count: followersData.count, status: followersData.status });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    followStatus(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followStatusData = yield this.userRepository.followStatus(userId, followerId);
                if (!followStatusData) {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "Invalid userId or followerId");
                }
                return (0, response_1.get200Response)(followStatusData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    unFollowUser(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unFollowData = yield this.userRepository.unfollowUser(userId, followerId);
                if (!unFollowData)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, "Invalid userId");
                return (0, response_1.get200Response)({ count: unFollowData.count, status: unFollowData.status });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    userSearch(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersData = yield this.userRepository.searchUsers(userId, query);
                return (0, response_1.get200Response)(usersData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    userFollowersList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followersData = yield this.userRepository.followersList(userId);
                console.log(followersData, "testing followers");
                return (0, response_1.get200Response)(followersData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    userFollowingList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followingData = yield this.userRepository.followingList(userId);
                console.log(followingData, "testing following");
                return (0, response_1.get200Response)(followingData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUser = yield this.userRepository.deleteUser(userId);
                return (0, response_1.get200Response)(deletedUser);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.UserUseCase = UserUseCase;
