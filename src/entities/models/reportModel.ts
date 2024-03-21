import mongoose, { Model, Schema,Document } from "mongoose";
import { ContentType, IReportReq } from "../../interfaces/Schema/reportSchema";

const reportSchema: Schema = new Schema<IReportReq & Document>(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    contentType: {
      type: String,
      enum: Object.values(ContentType),
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model
const reportModel: Model<IReportReq & Document> = mongoose.model<IReportReq & Document>("Report", reportSchema);

export default reportModel;
