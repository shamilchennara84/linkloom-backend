import mongoose, { Schema, Document, Model } from "mongoose";
import { ILikeSchema } from "../../interfaces/Schema/likeSchema";

const likeSchema: Schema<ILikeSchema & Document> = new Schema(
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const likeModel: Model<ILikeSchema> = mongoose.model<ILikeSchema>("Like", likeSchema);

export default likeModel;
