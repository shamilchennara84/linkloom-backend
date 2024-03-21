import mongoose from "mongoose";
import NotificationModel from "../../entities/models/notificationModel";
import { INotification, INotificationWithUser } from "../../interfaces/Schema/notificationSchema";
import followerModel from "../../entities/models/followersModel";

export class NotificationRepository {
  async saveNotification(notificationData: INotification): Promise<INotificationWithUser> {
    const newNotification = new NotificationModel(notificationData);
    const savedNotification = await newNotification.save();
    console.log(savedNotification, "savednotification");
    const result = await NotificationModel.aggregate([
      { $match: { _id: savedNotification._id } },
      {
        $lookup: {
          from: "users",
          localField: "relatedUserId",
          foreignField: "_id",
          as: "relatedUser",
        },
      },
      {
        $unwind: "$relatedUser",
      },
    ]);
    return result[0];
  }

  async getNotifications(userId: string): Promise<INotificationWithUser[]> {
    return NotificationModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "relatedUserId",
          foreignField: "_id",
          as: "relatedUser",
        },
      },
      {
        $unwind: "$relatedUser",
      },
    ]);
  }
  async getNotification(notificationId: string): Promise<INotificationWithUser | null> {
    return await NotificationModel.findById(notificationId);
  }

  async deleteNotification(notificationId: string) {
    return await NotificationModel.findByIdAndDelete(notificationId);
  }

  async acceptFriendRequest(relatedUserId: string, userId: string) {
    return await followerModel.findOneAndUpdate(
      { followerUserId: relatedUserId, followingUserId: userId },
      { isApproved: true }
    );
  }
  async rejectFriendRequest(relatedUserId: string, userId: string) {
    return await followerModel.findOneAndDelete({ followerUserId: relatedUserId, followingUserId: userId });
  }
}
