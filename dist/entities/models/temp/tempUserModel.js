"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempUserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const emailSchema_1 = require("../base/emailSchema");
const mobileSchema_1 = require("../base/mobileSchema");
const tempUserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minlength: [3, "Username must contain at least 3 characters"],
        maxlength: [20, "Username must contain at most 20 characters"],
        unique: true,
    },
    fullname: {
        type: String,
        required: [true, "Full name is required"],
        minlength: [3, "Full name must contain at least 3 characters"],
        maxlength: [20, "Full name must contain at most 20 characters"],
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    otpTries: {
        type: Number,
        default: 0,
    },
    otpExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 3 * 60 * 1000),
    },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000),
        expires: 60 * 15,
    },
});
tempUserSchema.add(emailSchema_1.emailSchema);
tempUserSchema.add(mobileSchema_1.mobileSchema);
tempUserSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 15 });
exports.tempUserModel = mongoose_1.default.model("TempUsers", tempUserSchema);
