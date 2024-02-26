import { createServer } from "./infrastructure/config/app";
import { mongoConnect } from "./infrastructure/config/db";
import http from "http";
import { Server, Socket } from "socket.io";
import { IChatReq } from "./interfaces/Schema/chatSchema";
import { chatUseCase } from "./providers/controllers";

const PORT = process.env.PORT || 3000;

const app = createServer();

mongoConnect()
  .then(() => {
    if (app) {
      // Create an HTTP server with the Express app
      const server = http.createServer(app);

      // Create a Socket.IO server on the same server
      const io = new Server(server, {
        cors: {
          origin: [process.env.CORS_URI as string],
          methods: ["GET", "POST"],
        },
      });

      const userSockets = new Map<string, string>();

      // Socket.IO logic for handling connections, events, etc.
      io.on("connection", (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;

        userSockets.set(userId, socket.id);
        console.log(`User ${userId} connected`);

        socket.on("send-message", async (chatData: IChatReq) => {
          try {
            console.log("chat recieved");
            const savedData = await chatUseCase.sendMessage(chatData);
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
              socket.to(userSockets.get(senderId) as string).emit("receive-message", savedData);
            }
          } catch (error) {
            console.error("Error while sending message:", error);
          }
        });

        // socket.on("create-conversation", async (members: IUser[]) => {
        //   try {
        //     const conversation = await chatUseCase.createConversation(members);

        //     // Emit the conversation creation event to all members
        //     members.forEach((member) => {
        //       const id = member._id.toString();
        //       if (userSockets.has(id)) {
        //         const socketId = userSockets.get(id);
        //         if (socketId) {
        //           socket.to(socketId.toString()).emit("conversation-created", conversation);
        //         }
        //       }
        //     });
        //   } catch (error) {
        //     console.error("Error while creating conversation:", error);
        //   }
        // });

        socket.on("disconnect", () => {
          console.log("User disconnected");
          userSockets.delete(userId);
        });
      });

      server.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));
    } else {
      throw Error("App is undefined");
    }
  })
  .catch((err) => console.error("Error while connecting to database:", err));



// socket.on("typing", (data: { senderId: string; recipientId: string }) => {
//   const recipientId = data.recipientId.toString();
//   const recipientSocketId = userSockets.get(recipientId);
//   if (recipientSocketId) {
//     socket.to(recipientSocketId).emit("typing", data);
//   }
// });
