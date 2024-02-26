import mongoose, { Model, Schema } from "mongoose";
import { IConversation } from "../../interfaces/Schema/chatSchema";

const conversationSchema: Schema = new Schema<IConversation & Document>(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the Users collection
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const ConversationalModel: Model<IConversation & Document> = mongoose.model<IConversation & Document>(
  "Conversation",
  conversationSchema
);

export default ConversationalModel;
