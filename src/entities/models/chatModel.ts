import mongoose, { Model, Schema } from "mongoose";
import { IChatReq, IChatRes } from "../../interfaces/Schema/chatSchema";

const chatSchema: Schema = new Schema<IChatReq & Document>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation", // Reference to the Conversation collection
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Users collection
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Users collection
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    messageType: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatModel: Model<IChatRes & Document> = mongoose.model<IChatRes & Document>("Chat", chatSchema);

export default ChatModel;