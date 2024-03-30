"use strict";
// src/infrastructure/config/socketIOHandler.ts
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
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const controllers_1 = require("../../providers/controllers");
function setupSocketIO(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: [process.env.CORS_URI],
            methods: ["GET", "POST"],
        },
    });
    const userSockets = new Map();
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} connected`);
        socket.on("send-message", (chatData) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("chat received");
                const savedData = yield controllers_1.chatUseCase.sendMessage(chatData);
                const recipientId = chatData.recieverId.toString();
                const senderId = chatData.senderId.toString();
                if (userSockets.has(recipientId)) {
                    const recipientSocketId = userSockets.get(recipientId);
                    if (recipientSocketId) {
                        socket.to(recipientSocketId).emit("receive-message", savedData);
                    }
                }
                if (userSockets.has(senderId)) {
                    socket.to(userSockets.get(senderId)).emit("receive-message", savedData);
                }
            }
            catch (error) {
                console.error("Error while sending message:", error);
            }
        }));
        socket.on("send-notification", (notificationData) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(notificationData, "notification recieved");
                const newNotification = yield controllers_1.notificationUseCase.sendNotification(notificationData);
                const recipientId = newNotification.userId.toString();
                // const senderId = newNotification.data!.relatedUserId!.toString();
                if (userSockets.has(recipientId)) {
                    const recipientSocketId = userSockets.get(recipientId);
                    if (recipientSocketId) {
                        socket.to(recipientSocketId).emit("receive-notification", newNotification);
                    }
                }
            }
            catch (error) {
                console.error("Error while sending notification", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("User disconnected");
            userSockets.delete(userId);
        });
    });
}
exports.setupSocketIO = setupSocketIO;
