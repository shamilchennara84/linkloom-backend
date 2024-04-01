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
exports.TempUserRepository = void 0;
const tempUserModel_1 = require("../../entities/models/temp/tempUserModel");
class TempUserRepository {
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempUserModel_1.tempUserModel.findOneAndUpdate({ email: user.email }, {
                $set: {
                    fullname: user.fullname,
                    username: user.username,
                    mobile: user.mobile,
                    email: user.email,
                    password: user.password,
                    otp: user.otp,
                    expireAt: Date.now(),
                },
            }, { upsert: true, new: true, setDefaultsOnInsert: true });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempUserModel_1.tempUserModel.findOne({ email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempUserModel_1.tempUserModel.findById(id);
        });
    }
    unsetOtp(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempUserModel_1.tempUserModel.findByIdAndUpdate({ _id: id }, { $unset: { otp: 1 } }, { new: true });
        });
    }
    updateOtp(id, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield tempUserModel_1.tempUserModel.findByIdAndUpdate(id, {
                $set: { otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), otp: OTP },
            }, { new: true });
            return user;
        });
    }
    updateOtpTries(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield tempUserModel_1.tempUserModel.findByIdAndUpdate({ _id: id }, { $inc: { otpTries: 1 } }, { new: true });
            return user;
        });
    }
}
exports.TempUserRepository = TempUserRepository;
