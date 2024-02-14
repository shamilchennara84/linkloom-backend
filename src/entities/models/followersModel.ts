import mongoose, { Schema, Document, Model } from "mongoose";
import { IFollowerReq } from "../../interfaces/Schema/followerSchema"; // Import your follower schema interface

const followerSchema: Schema = new Schema<IFollowerReq & Document>(
  {
    followerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the Users collection for follower user
      required: true,
    },
    followingUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the Users collection for following user
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const followerModel: Model<IFollowerReq & Document> = mongoose.model<IFollowerReq & Document>(
  "Follower",
  followerSchema
);

export default followerModel;