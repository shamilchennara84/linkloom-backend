import { ChatUseCase } from "../../useCases/chatUseCase";
import { RequestWithUser } from "../../infrastructure/middleware/userAuth";
import { ID } from "../../interfaces/common";
import { Request, Response } from "express";

export class ChatController {
  constructor(private chatUseCase: ChatUseCase) {}

  async getFollowedUser(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userid as ID;
      const apiResponse = await this.chatUseCase.getFollowedUsers(userId);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async getConversation(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userid as unknown as string;
      const secondUserId = req.params.userId;
      const apiResponse = await this.chatUseCase.getConversation([userId, secondUserId]);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async getConversations(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userid as unknown as string;
      const apiResponse = await this.chatUseCase.getConversations(userId);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async getChatHistory(req: Request, res: Response) {
    try {
      console.log("getting chat history");
      const conversationId = req.params.roomId;
      const apiResponse = await this.chatUseCase.getChats(conversationId);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }
}
