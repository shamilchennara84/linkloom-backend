"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtToken_1 = require("../../providers/jwtToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
const tokenRouter = express_1.default.Router();
const jwtToken = new jwtToken_1.JWTtoken();
tokenRouter.get("/", (req, res) => {
    try {
        const refreshToken = req.headers.authorization;
        if (refreshToken) {
            const decoded = jsonwebtoken_1.default.verify(refreshToken.slice(7), process.env.JWT_SECRET_KEY);
            const accessToken = jwtToken.generateAccessToken(decoded.userId);
            res.status(httpStatusCodes_1.STATUS_CODES.OK).json({
                status: httpStatusCodes_1.STATUS_CODES.OK,
                message: "Success",
                accessToken,
            });
        }
        else {
            res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({
                status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                message: "Unauthorized",
                accessToken: "",
            });
        }
    }
    catch (error) {
        console.log(error, "error while generating access token");
        res.status(httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: error.message,
            accessToken: "",
        });
    }
});
exports.default = tokenRouter;
