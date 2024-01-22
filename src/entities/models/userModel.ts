import mongoose, { Schema, Document, Model } from "mongoose";
import { User } from "../../interfaces/schemaInterface";

const userSchema: Schema = new Schema<User & Document>({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  mobile: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
  },
  dob: {
    type: Date,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isPremier: {
    type: Boolean,
    default: false,
  },
  premiumExpiry: {
    type: Date,
    default: null,
  },
  profilePic: {
    type: String,
    default: null,
  },
  visibility: {
    type: String,
    default: "public",
  },
  location: {
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
  },
  lastloggedin: {
    type: Number,
    default: Date.now(),
  },
});

const userModel: Model<User & Document> = mongoose.model<User & Document>("Users", userSchema);

export default userModel;









// address: {
//     country: {
//       type: String,
//       required: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     district: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     zip: {
//       type: Number,
//       required: true,
//     },
//   },