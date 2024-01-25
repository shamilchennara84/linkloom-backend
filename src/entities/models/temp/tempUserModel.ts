import mongoose, { Model, Schema } from "mongoose";
import { ITempUserRes } from "../../../interfaces/Schema/tempUserSchema";
import { emailSchema } from "../base/emailSchema";
import { mobileSchema } from "../base/mobileSchema";

const tempUserSchema: Schema = new Schema<ITempUserRes & Document>({
  username: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must contain at least 3 characters"],
    maxlength: [20, "Name must contain at most 20 characters"],
    unique: true,
  },
  fullname: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must contain at least 3 characters"],
    maxlength: [20, "Name must contain at most 20 characters"],
  },
  password: {
    type: String,
    retured: true,
  },
  expireAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 15,
  },
});

tempUserSchema.add(emailSchema);
tempUserSchema.add(mobileSchema);
tempUserSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 15 });

export const tempUserModel: Model<ITempUserRes & Document> = mongoose.model<
  ITempUserRes & Document
>("TempUsers", tempUserSchema);
