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
exports.NotificationUseCase = void 0;
const response_1 = require("../helperFunctions/response");
class NotificationUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    sendNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield this.notificationRepository.saveNotification(notificationData);
                return notification;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield this.notificationRepository.getNotifications(userId);
                console.log(notifications);
                return (0, response_1.get200Response)(notifications);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationRemoved = yield this.notificationRepository.deleteNotification(notificationId);
                return (0, response_1.get200Response)(notificationRemoved);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    acceptFriendRequest(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield this.notificationRepository.getNotification(notificationId);
                console.log(notification, "notif");
                if (!notification || !notification.relatedUserId || !notification.userId) {
                    throw new Error("Notification is null or properties relatedUserId or userId are undefined");
                }
                yield this.notificationRepository.acceptFriendRequest(notification.relatedUserId.toString(), notification.userId.toString());
                yield this.notificationRepository.deleteNotification(notificationId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    rejectFriendRequest(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield this.notificationRepository.getNotification(notificationId);
                if (!notification || !notification.relatedUserId || !notification.userId) {
                    throw new Error("Notification is null or properties relatedUserId or userId are undefined");
                }
                yield this.notificationRepository.rejectFriendRequest(notification.relatedUserId.toString(), notification.userId.toString());
                yield this.notificationRepository.deleteNotification(notificationId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.NotificationUseCase = NotificationUseCase;
