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
const app_1 = require("./infrastructure/config/app");
const db_1 = require("./infrastructure/config/db");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const controllers_1 = require("./providers/controllers");
const PORT = process.env.PORT || 3000;
const app = (0, app_1.createServer)();
(0, db_1.mongoConnect)()
    .then(() => {
    if (app) {
        // Create an HTTP server with the Express app
        const server = http_1.default.createServer(app);
        // Create a Socket.IO server on the same server
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: [process.env.CORS_URI],
                methods: ["GET", "POST"],
            },
        });
        const userSockets = new Map();
        // Socket.IO logic for handling connections, events, etc.
        io.on("connection", (socket) => {
            const userId = socket.handshake.query.userId;
            userSockets.set(userId, socket.id);
            console.log(`User ${userId} connected`);
            socket.on("send-message", (chatData) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    console.log("chat recieved");
                    const savedData = yield controllers_1.chatUseCase.sendMessage(chatData);
                    const recipientId = chatData.recieverId.toString();
                    const senderId = chatData.senderId.toString();
                    // Emit the message to the recipient
                    if (userSockets.has(recipientId)) {
                        const recipientSocketId = userSockets.get(recipientId);
                        if (recipientSocketId) {
                            socket.to(recipientSocketId).emit("receive-message", savedData);
                        }
                    }
                    // Emit the message to the sender
                    if (userSockets.has(senderId)) {
                        socket.to(userSockets.get(senderId)).emit("receive-message", savedData);
                    }
                }
                catch (error) {
                    console.error("Error while sending message:", error);
                }
            }));
            socket.on("disconnect", () => {
                console.log("User disconnected");
                userSockets.delete(userId);
            });
        });
        server.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));
    }
    else {
        throw Error("App is undefined");
    }
})
    .catch((err) => console.error("Error while connecting to database:", err));
