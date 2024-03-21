import { Schema } from "mongoose";
import { IUserChatSearch, IUserRes, IUsersAndCount } from "./Schema/userSchema";
import { IPostPerMonth, IPostPerYear, IPostRes } from "./Schema/postSchema";
import { ILikeCountRes } from "./Schema/likeSchema";
import { ICommentSchema } from "./Schema/commentSchema";
import { IFollowCountRes, IFollowStatus, IUserSearchItem } from "./Schema/followerSchema";
import { IChatHistoryItem, IConversation, IConversationListItem } from "./Schema/chatSchema";
import { IUserPerMonth, IUserPerYear, IAdminCardData } from "./Schema/adminSchema";
import { ITagRes } from "./Schema/tagSchema";
import { INotificationRes, INotificationWithUser } from "./Schema/notificationSchema";

export type ID = Schema.Types.ObjectId;

export interface ICoords {
  type: "Point";
  coordinates: [number, number];
}

export interface IUserAddress {
  country: string;
  state: string;
  district: string;
  city: string;
  zip: number;
}

export type AllResTypes =
  | IUserRes
  | IUserRes[]
  | IUsersAndCount
  | IPostRes
  | IPostRes[]
  | ILikeCountRes
  | ICommentSchema
  | IFollowCountRes
  | IFollowStatus
  | IConversation
  | IConversation[]
  | IChatHistoryItem[]
  | IConversationListItem[]
  | IUserSearchItem[]
  | IUserChatSearch[]
  | IUserPerMonth[]
  | IUserPerYear[]
  | IPostPerMonth[]
  | IPostPerYear[]
  | IAdminCardData
  | ITagRes
  | INotificationWithUser
  | INotificationWithUser[]
  | INotificationRes
  | null;

export interface IApiResponse<T extends AllResTypes> {
  status: number;
  message: string;
  data: T;
}
