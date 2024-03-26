// src/infrastructure/config/socketIOHandler.ts

import { Server, Socket } from "socket.io";
import { IChatReq } from "../../interfaces/Schema/chatSchema";
import { chatUseCase,notificationUseCase } from "../../providers/controllers";
import * as http from "http";
import { INotification } from "../../interfaces/Schema/notificationSchema";


export function setupSocketIO(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: [process.env.CORS_URI as string],
      methods: ["GET", "POST"],
    },
  });

  const userSockets = new Map<string, string>();

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} connected`);

    socket.on("send-message", async (chatData: IChatReq) => {
      try {
        console.log("chat received");
        const savedData = await chatUseCase.sendMessage(chatData);
        const recipientId = chatData.recieverId.toString();
        const senderId = chatData.senderId.toString();

        if (userSockets.has(recipientId)) {
          const recipientSocketId = userSockets.get(recipientId);
          if (recipientSocketId) {
            socket.to(recipientSocketId).emit("receive-message", savedData);
          }
        }

        if (userSockets.has(senderId)) {
          socket.to(userSockets.get(senderId) as string).emit("receive-message", savedData);
        }
      } catch (error) {
        console.error("Error while sending message:", error);
      }
    });

    socket.on("send-notification",async (notificationData: INotification) => {
      try {
        console.log(notificationData,"notification recieved");
        const newNotification = await notificationUseCase.sendNotification(notificationData)
          const recipientId = newNotification!.userId!.toString();
          // const senderId = newNotification.data!.relatedUserId!.toString();

           if (userSockets.has(recipientId)) {
             const recipientSocketId = userSockets.get(recipientId);
             if (recipientSocketId) {
               socket.to(recipientSocketId).emit("receive-notification", newNotification);
             }
           }
        
      } catch (error) {
        console.error("Error while sending notification", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      userSockets.delete(userId);
    });
  });
}
