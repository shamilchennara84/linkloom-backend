import { ChatUseCase } from "../../useCases/chatUseCase";
import { RequestWithUser } from "../../infrastructure/middleware/userAuth";
import { ID } from "../../interfaces/common";
import { Request, Response } from "express-serve-static-core";

export class ChatController {
  constructor(private chatUseCase: ChatUseCase) {}

  async getFollowedUser(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userid as ID;
      const apiRes = await this.chatUseCase.getFollowedUsers(userId);
      res.status(apiRes.status).json(apiRes);
    } catch (error) {
      console.log(error);
    }
  }

  async getConversation(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userid as unknown as string;
      const secondUserId = req.params.userId;
      const apiRes = await this.chatUseCase.getConversation([userId, secondUserId]);
      res.status(apiRes.status).json(apiRes);
    } catch (error) {
      console.log(error);
    }
  }

  async getConversations(req: RequestWithUser, res: Response){
    try {
      const userId = req.userid as unknown as string;
      const apiRes = await this.chatUseCase.getConversations(userId);
      res.status(apiRes.status).json(apiRes);
    } catch (error) {
     console.log(error);
    }
  }

  async getChatHistory(req: Request, res: Response) {
    try {
      const conversationId = req.params.roomId;
      const apiRes = await this.chatUseCase.getChats(conversationId);
      res.status(apiRes.status).json(apiRes);
    } catch (error) {
      console.log(error);
    }
  }
}
