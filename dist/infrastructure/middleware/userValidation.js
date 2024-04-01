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
exports.userRegisterValidation = void 0;
const userRepository_1 = require("../repositories/userRepository");
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const userRepository = new userRepository_1.UserRepository();
const { INTERNAL_SERVER_ERROR } = httpStatusCodes_1.STATUS_CODES;
const userRegisterValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email } = req.body;
        const isUsernameExist = yield userRepository.findByUname(username);
        if (isUsernameExist) {
            return res
                .status(httpStatusCodes_1.STATUS_CODES.FORBIDDEN)
                .json({ message: "Username already Exist" });
        }
        const isEmailExist = yield userRepository.findByEmail(email);
        if (isEmailExist) {
            return res
                .status(httpStatusCodes_1.STATUS_CODES.FORBIDDEN)
                .json({ message: "Email already Exist" });
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Not authorized, invalid token" });
    }
});
exports.userRegisterValidation = userRegisterValidation;
