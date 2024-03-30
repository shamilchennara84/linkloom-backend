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
exports.NotificationController = void 0;
class NotificationController {
    constructor(notificationUseCase) {
        this.notificationUseCase = notificationUseCase;
    }
    getAllNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userid;
                const apiResponse = yield this.notificationUseCase.getNotifications(userId.toString());
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("notification deleted");
                const notificationId = req.params.notificationId;
                console.log("notificationId", notificationId);
                const apiResponse = yield this.notificationUseCase.deleteNotification(notificationId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    acceptFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("accept");
                const notificationId = req.params.notificationId;
                const friendResponse = yield this.notificationUseCase.acceptFriendRequest(notificationId); // Assuming request body contains friend data
                res.status(friendResponse.status).json(friendResponse);
            }
            catch (error) {
                console.error("Error accepting friend request:", error); // More informative error message
            }
        });
    }
    rejectFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationId = req.params.notificationId;
                const friendResponse = yield this.notificationUseCase.rejectFriendRequest(notificationId); // Assuming request body contains friend data
                res.status(friendResponse.status).json(friendResponse);
            }
            catch (error) {
                console.error("Error rejecting friend request:", error); // More informative error message
            }
        });
    }
}
exports.NotificationController = NotificationController;
