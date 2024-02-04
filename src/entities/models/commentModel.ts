import mongoose, { Schema, Document, Model } from "mongoose";
import { ICommentSchema } from "../../interfaces/Schema/commentSchema";



const commentSchema: Schema<ICommentSchema & Document> = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post collection, assuming that's where post data is stored
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the Users collection, assuming that's where user data is stored
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const commentModel: Model<ICommentSchema> = mongoose.model<ICommentSchema>("Comment", commentSchema);

export default commentModel;
