import { ID } from "../common";
import {ILikeRes } from "./likeSchema";
import { IUserRes } from "./userSchema";

export interface IPostReq {
  userId: ID;
  postURL: string;
  caption: string;
  location: string;
  createdAt: Date;
}

export interface IPostRes extends IPostReq {
  _id: ID;
}
export interface IPostUserRes extends IPostRes {
  user: IUserRes;
  likes: ILikeRes[];
  likeCount: number;
  likedByCurrentUser: boolean;
}
