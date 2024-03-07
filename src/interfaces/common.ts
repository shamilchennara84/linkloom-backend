import { Schema } from "mongoose";
import { IUserChatSearch, IUserRes, IUsersAndCount } from "./Schema/userSchema";
import { IPostPerMonth, IPostPerYear, IPostRes } from "./Schema/postSchema";
import { ILikeCountRes } from "./Schema/likeSchema";
import { ICommentSchema } from "./Schema/commentSchema";
import { IFollowCountRes, IFollowStatus, IUserSearchItem } from "./Schema/followerSchema";
import { IChatHistoryItem, IConversation, IConversationListItem } from "./Schema/chatSchema";
import { IUserPerMonth, IUserPerYear, IAdminCardData } from "./Schema/adminSchema";
import { ITagRes } from "./Schema/tagSchema";

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
  | null;

export interface IapiResponse<T extends AllResTypes> {
  status: number;
  message: string;
  data: T;
}
