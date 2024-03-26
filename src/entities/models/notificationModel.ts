import mongoose, { Document, Model, Schema } from "mongoose";
import { INotification, NotificationType } from "../../interfaces/Schema/notificationSchema";

const notificationSchema: Schema = new Schema<INotification & Document>(
  {
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming there's a User model
      required: true,
    },
    relatedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming there's a User model
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Assuming there's a Post model
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Assuming there's a Comment model
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const NotificationModel: Model<INotification & Document> = mongoose.model<INotification & Document>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
