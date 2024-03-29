import { ID } from "../common";
import { ILikeRes } from "./likeSchema";
import { IUserRes } from "./userSchema";

export interface IPostReq {
  userId: ID;
  postURL: string;
  caption: string;
  location: string;
  createdAt: Date;
  isRemoved?: boolean;
}

export interface IPostRes extends IPostReq {
  _id: ID;
}
export interface IPostUserRes extends IPostRes {
  user: IUserRes;
  likes: ILikeRes[];
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  taggedByCurrentUser: boolean;
  reportedByCurrentUser: boolean;
}

export interface IPostPerMonth {
  monthYear: string;
  count: number;
  likes: number;
  comments: number;
}

export interface IPostPerYear {
  year: string;
  count: number;
  likes: number;
  comments: number;
}
