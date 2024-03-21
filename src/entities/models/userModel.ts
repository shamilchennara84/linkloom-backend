import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../../interfaces/Schema/userSchema";
import { userAddressSchema } from "./subSchema/addressSchema";
import { emailSchema } from "./base/emailSchema";
import { mobileSchema } from "./base/mobileSchema";

enum Visibility {
  Public = "public",
  Private = "private",
}

const userSchema: Schema = new Schema<IUser & Document>(
  {
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
      required() {
        return !this.isGoogleAuth;
      },
    },
    bio: {
      type: String,
      default: "Add Bio",
    },
    isBlocked: {
      type: Boolean,
      default: false,
      required: true,
    },
    isGoogleAuth: {
      type: Boolean,
      required: true,
      default: false,
    },
    dob: {
      type: Date,
      default: new Date("1990-01-01"),
      min: new Date("1900-01-01"),
      max: new Date(),
      required: true,
    },
    profilePic: { type: String },
    coords: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        min: 2,
        max: 2,
      },
    },
    isPremier: { type: Boolean, default: false },
    premiumExpiry: { type: Date, default: null },
    visibility: {
      type: String,
      enum: Object.values(Visibility),
      default: Visibility.Public,
    },
    address: userAddressSchema,
    isDeleted: {
      type: Boolean,
      default: false, 
    },
  },

  { timestamps: true }
);

userSchema.add(emailSchema);
userSchema.add(mobileSchema);

const userModel: Model<IUser & Document> = mongoose.model<IUser & Document>("Users", userSchema);

export default userModel;
