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
exports.NotificationRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationModel_1 = __importDefault(require("../../entities/models/notificationModel"));
const followersModel_1 = __importDefault(require("../../entities/models/followersModel"));
class NotificationRepository {
    saveNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newNotification = new notificationModel_1.default(notificationData);
            const savedNotification = yield newNotification.save();
            console.log(savedNotification, "savednotification");
            const result = yield notificationModel_1.default.aggregate([
                { $match: { _id: savedNotification._id } },
                {
                    $lookup: {
                        from: "users",
                        localField: "relatedUserId",
                        foreignField: "_id",
                        as: "relatedUser",
                    },
                },
                {
                    $unwind: "$relatedUser",
                },
            ]);
            return result[0];
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return notificationModel_1.default.aggregate([
                { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "relatedUserId",
                        foreignField: "_id",
                        as: "relatedUser",
                    },
                },
                {
                    $unwind: "$relatedUser",
                },
            ]);
        });
    }
    getNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notificationModel_1.default.findById(notificationId);
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notificationModel_1.default.findByIdAndDelete(notificationId);
        });
    }
    acceptFriendRequest(relatedUserId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield followersModel_1.default.findOneAndUpdate({ followerUserId: relatedUserId, followingUserId: userId }, { isApproved: true });
        });
    }
    rejectFriendRequest(relatedUserId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield followersModel_1.default.findOneAndDelete({ followerUserId: relatedUserId, followingUserId: userId });
        });
    }
}
exports.NotificationRepository = NotificationRepository;
