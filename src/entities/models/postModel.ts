import mongoose, { Schema, Document, Model } from "mongoose";
 import { IPostReq } from "../../interfaces/Schema/postSchema";

const postSchema: Schema = new Schema<IPostReq & Document>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", 
      required: true,
    },
    postURL: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const postModel: Model<IPostReq & Document> = mongoose.model<IPostReq & Document>("Post", postSchema);

export default postModel;
