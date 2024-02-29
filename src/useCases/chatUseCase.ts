import ConversationModel from "../entities/models/conversationModel";
import { get200Response, get500Response } from "../infrastructure/helperfunctions/response";
import { ChatRepository } from "../infrastructure/repositories/chatRepository";
import { IChatHistoryItem, IChatReq, IConversation, IConversationListItem } from "../interfaces/Schema/chatSchema";
import { IUserChatSearch } from "../interfaces/Schema/userSchema";
import { IapiResponse, ID } from "../interfaces/common";

export class ChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async sendMessage(chatData: IChatReq) {
    try {
      const savedChat = await this.chatRepository.saveChat(chatData);
      return savedChat;
    } catch (error) {
      throw new Error(`Error while sending message: ${error}`);
    }
  }

  async getConversation(members: string[]): Promise<IapiResponse<IConversation | null>> {
    try {
      // const memberIds = members.map((member) => member._id);
      const existingConversation = await ConversationModel.findOne({ members: { $all: members } });
      if (existingConversation) {
        return get200Response(existingConversation);
      }
      console.log(members);
      const newConversation = new ConversationModel({ members });
      const savedConversation = await newConversation.save();
      return get200Response(savedConversation);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async getConversations(userId: string): Promise<IapiResponse<IConversationListItem[] | null>> {
    try {
      const chatHistoryItems = await this.chatRepository.getConversations(userId);
      return get200Response(chatHistoryItems);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async getFollowedUsers(userId: ID): Promise<IapiResponse<IUserChatSearch[] | null>> {
    try {
      const usersData = await this.chatRepository.findAllFollowers(userId);
      return get200Response(usersData);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async getChats(conversationId: string): Promise<IapiResponse<IChatHistoryItem[] | null>> {
    try {
      const chatHistory = await this.chatRepository.getChatHistory(conversationId);
      return get200Response(chatHistory);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
}
