import { get200Response, get500Response } from "../helperFunctions/response";
import { NotificationRepository } from "../infrastructure/repositories/notificationRepository";
import { INotification, INotificationRes, INotificationWithUser } from "../interfaces/Schema/notificationSchema";
import { IApiResponse } from "../interfaces/common";

export class NotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async sendNotification(notificationData: INotification): Promise<INotificationWithUser | null> {
    try {
      const notification = await this.notificationRepository.saveNotification(notificationData);
      return notification;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getNotifications(userId: string): Promise<IApiResponse<INotificationWithUser[] | null>> {
    try {
      const notifications = await this.notificationRepository.getNotifications(userId);
      console.log(notifications);

      return get200Response(notifications);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
  async deleteNotification(notificationId: string): Promise<IApiResponse<INotificationRes | null>> {
    try {
      const notificationRemoved = await this.notificationRepository.deleteNotification(notificationId);
      return get200Response(notificationRemoved);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async acceptFriendRequest(notificationId: string): Promise<IApiResponse<null>> {
    try {
      const notification = await this.notificationRepository.getNotification(notificationId);
      console.log(notification, "notif");
      if (!notification || !notification.relatedUserId || !notification.userId) {
        throw new Error("Notification is null or properties relatedUserId or userId are undefined");
      }
      await this.notificationRepository.acceptFriendRequest(
        notification.relatedUserId.toString(),
        notification.userId.toString()
      );
      await this.notificationRepository.deleteNotification(notificationId);
      return get200Response(null);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
  async rejectFriendRequest(notificationId: string): Promise<IApiResponse<null>> {
    try {
      const notification = await this.notificationRepository.getNotification(notificationId);

      if (!notification || !notification.relatedUserId || !notification.userId) {
        throw new Error("Notification is null or properties relatedUserId or userId are undefined");
      }
      await this.notificationRepository.rejectFriendRequest(
        notification.relatedUserId.toString(),
        notification.userId.toString()
      );
      await this.notificationRepository.deleteNotification(notificationId);
      return get200Response(null);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
}
