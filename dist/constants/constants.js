"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthMapping = exports.passwordRegex = exports.nameRegex = exports.userNameMaxLength = exports.userNameMinLength = exports.ZipRegex = exports.OTPRegex = exports.passwordMinLength = exports.emailRegex = exports.tempTokenExp = exports.refreshTokenExp = exports.accessTokenExp = exports.MAX_OTP_TRY = exports.OTP_TIMER = void 0;
exports.OTP_TIMER = 1000 * 60 * 3;
exports.MAX_OTP_TRY = 3;
// export const accessTokenExp = 1 * 30 ; // 3 hour
exports.accessTokenExp = 3 * 60 * 60; // 3 hour
exports.refreshTokenExp = 24 * 60 * 60; // 24 hour
// export const refreshTokenExp = 24 * 60 * 60; // 24 hour
exports.tempTokenExp = 10 * 60; // 10 min
exports.emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
exports.passwordMinLength = 8;
exports.OTPRegex = "^[1-9][0-9]{3}$";
exports.ZipRegex = "^[1-9][0-9]{5}$";
exports.userNameMinLength = 3;
exports.userNameMaxLength = 20;
exports.nameRegex = "^[a-zA-Z ]{3,20}$";
exports.passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";
exports.monthMapping = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
};
