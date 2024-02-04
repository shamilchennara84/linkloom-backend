import mongoose, { Model, Schema } from "mongoose";
import { IAdmin } from "../../interfaces/Schema/adminSchema";
import { emailSchema } from "./base/emailSchema";

const adminSchema: Schema = new Schema<IAdmin & Document>({
  password: {
    type: String,
    required: true,
  },
});

adminSchema.add(emailSchema);


export const adminModel: Model<IAdmin & Document> = mongoose.model<IAdmin & Document>(
  "Admin",
  adminSchema
);
