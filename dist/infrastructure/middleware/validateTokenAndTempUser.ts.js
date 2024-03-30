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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenAndTempUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const tempUserRepository_1 = require("../repositories/tempUserRepository");
const tempUserRepository = new tempUserRepository_1.TempUserRepository();
const validateTokenAndTempUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authToken = req.headers.authorization;
        if (!authToken) {
            return res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: "authToken missing, Register again" });
        }
        const decoded = jsonwebtoken_1.default.verify(authToken.slice(7), process.env.JWT_SECRET_KEY);
        const user = yield tempUserRepository.findById(decoded.userId);
        if (!user) {
            return res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: "Timeout, Register again" });
        }
        // Attach the user object to the request
        req["user"] = user;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error("Error in validateTokenAndTempUser middleware:", error);
        res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid token or user" });
    }
});
exports.validateTokenAndTempUser = validateTokenAndTempUser;
