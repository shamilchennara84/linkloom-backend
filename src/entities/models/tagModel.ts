import mongoose, { Schema, Document, Model } from "mongoose";
import { ITagSchema } from "../../interfaces/Schema/tagSchema"; // Assuming you have an interface for the tag schema

const tagSchema: Schema<ITagSchema & Document> = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post collection
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const tagModel: Model<ITagSchema & Document> = mongoose.model<ITagSchema & Document>("Tag", tagSchema);

export default tagModel;
