"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOTP = void 0;
class GenerateOTP {
    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000);
    }
}
exports.GenerateOTP = GenerateOTP;
