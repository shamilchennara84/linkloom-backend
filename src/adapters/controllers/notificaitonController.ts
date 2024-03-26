

import { RequestWithUser } from "../../infrastructure/middleware/userAuth";
import { ID } from "../../interfaces/common";
import { NotificationUseCase } from "../../useCases/notificationUseCases";
import { Request, Response } from "express";

export class NotificationController {
  constructor(private notificationUseCase: NotificationUseCase) {}

  async getAllNotification(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userid as ID;
      const apiResponse = await this.notificationUseCase.getNotifications(userId.toString());

      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      console.log("notification deleted");
      const notificationId = req.params.notificationId;
      console.log("notificationId", notificationId);
      const apiResponse = await this.notificationUseCase.deleteNotification(notificationId);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async acceptFriendRequest(req: Request, res: Response) {
    try {
      console.log("accept");
      const notificationId = req.params.notificationId;
      const friendResponse = await this.notificationUseCase.acceptFriendRequest(notificationId); // Assuming request body contains friend data
      res.status(friendResponse.status).json(friendResponse);
    } catch (error) {
      console.error("Error accepting friend request:", error); // More informative error message
    }
  }

  async rejectFriendRequest(req: Request, res: Response) {
    try {
      const notificationId = req.params.notificationId;
      const friendResponse = await this.notificationUseCase.rejectFriendRequest(notificationId); // Assuming request body contains friend data
      res.status(friendResponse.status).json(friendResponse);
    } catch (error) {
      console.error("Error rejecting friend request:", error); // More informative error message
    }
  }


}
