import { Schema } from "mongoose";
import { IUserAddress } from "../../../interfaces/common";
import { ZipRegex } from "../../../constants/constants";




export const userAddressSchema: Schema = new Schema<IUserAddress & Document>({
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  district: {
    type: String,
    required: [true, "District is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  zip: {
    type: Number,
    match: [
      new RegExp(ZipRegex),
      "Invalid ZIP code. Please enter a valid 6-digit ZIP code.",
    ],
    required: [true, "Zip is required"],
  },
});