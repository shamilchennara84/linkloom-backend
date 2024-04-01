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
exports.AdminUseCase = void 0;
// import { get200Response, get500Response } from "infrastructure/helperFunctions/response";
const response_1 = require("../helperFunctions/response");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
class AdminUseCase {
    constructor(encrypt, adminRepository, jwtToken) {
        this.encrypt = encrypt;
        this.adminRepository = adminRepository;
        this.jwtToken = jwtToken;
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this.adminRepository.findAdmin();
            if (adminData !== null) {
                const passwordMatch = yield this.encrypt.comparePassword(password, adminData.password);
                if (passwordMatch) {
                    const accessToken = this.jwtToken.generateAccessToken(adminData._id);
                    const refreshToken = this.jwtToken.generateRefreshToken(adminData._id);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: "Success",
                        data: adminData,
                        accessToken,
                        refreshToken,
                    };
                }
                else {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                        message: "Invalid Email or Password",
                        data: null,
                        accessToken: "",
                        refreshToken: "",
                    };
                }
            }
            else {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                    message: "Invalid Email or Password",
                    data: null,
                    accessToken: "",
                    refreshToken: "",
                };
            }
        });
    }
    newUsersPerMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.adminRepository.findUserPerMonth();
                return (0, response_1.get200Response)(userData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    newUsersPerYear() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.adminRepository.findUserPerYear();
                return (0, response_1.get200Response)(userData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // async postmatrixPerYear() {
    //  try {
    //   const postData = await this.adminRepository.postPerYear();
    //   return get200Response(postData);
    //  } catch (error) {
    //   return get500Response(error as Error)
    //  }
    // }
    postMatrixPerMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield this.adminRepository.postPerMonth();
                return (0, response_1.get200Response)(postData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getIAdminCardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cardData = yield this.adminRepository.getCardData();
                return (0, response_1.get200Response)(cardData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.AdminUseCase = AdminUseCase;
