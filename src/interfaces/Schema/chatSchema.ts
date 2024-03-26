import { Schema } from "mongoose";
import { ID } from "../common";
import { IUser } from "./userSchema";

export interface IConversation {
  members: ID[];
}

export interface IConversationListItem extends IConversation {
  unreadCount: number;
  lastChat: IChatHistoryItem;
  otherMemberUsername: string;
  otherMemberProfilePic: string;
}

export interface IChatHistoryItem extends IChatReq {
  sendersInfo: IUser;
}

export interface IChatHistoryResponse {
  data: IChatHistoryItem[];
  isLastSet: boolean;
}

// Interface for Chat document
export interface IChatReq {
  conversationId: ID;
  senderId: ID;
  recieverId: ID;
  content: string;
  createdAt: Date;
  messageType: string;
  read: boolean;
}
export interface IchatResponse extends IChatReq {
  _id: Schema.Types.ObjectId;
}
