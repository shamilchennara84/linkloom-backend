import mongoose, { Model, Schema } from "mongoose";
import { ITempUserRes } from "../../../interfaces/Schema/tempUserSchema";
import { emailSchema } from "../base/emailSchema";
import { mobileSchema } from "../base/mobileSchema";

const tempUserSchema: Schema<ITempUserRes & Document> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must contain at least 3 characters"],
    maxlength: [20, "Username must contain at most 20 characters"],
    unique: true,
  },
  fullname: {
    type: String,
    required: [true, "Full name is required"],
    minlength: [3, "Full name must contain at least 3 characters"],
    maxlength: [20, "Full name must contain at most 20 characters"],
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  otpTries: {
    type: Number,
    default: 0,
  },
  otpExpiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 60 * 1000),
  },

  expireAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000),
    expires: 60 * 15,
  },
});

tempUserSchema.add(emailSchema);
tempUserSchema.add(mobileSchema);

tempUserSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 15 });

export const tempUserModel: Model<ITempUserRes & Document> = mongoose.model<
  ITempUserRes & Document
>("TempUsers", tempUserSchema);
