import { ID } from "../common";
import { IUserRes } from "./userSchema";

export interface INotification {
  type: NotificationType; // Type of the notification
  message: string; // Message or description of the notification
  timestamp: Date; // Time when the notification was created
  userId: ID; // ID of the user who triggered the notification
  relatedUserId?: string; // ID of the user related to the notification
  postId?: string; // ID of the post related to the notification
  commentId?: string; // ID of the comment related to the notification
  isRead: boolean;
}

export interface INotificationRes extends INotification {
  _id: string;
  relatedUser:IUserRes
}

export enum NotificationType {
  FollowRequest = "FOLLOW_REQUEST",
  Liked = "LIKED",
  MostCommented = "MOST_COMMENTED",
  Followed = "FOLLOWED",
  AcceptedRequest = "FOLLOWED_REQUEST_ACCEPTED",
}
