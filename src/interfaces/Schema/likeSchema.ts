import { ID } from "../common";


export interface ILikeSchema {
  postId: ID;
  userId: ID;
  createdAt: Date;
}
export interface ILikeRes{
  _id:ID
  postId: ID;
  userId: ID;
  createdAt: Date;
}
export interface ILikeCountRes {
  count:number;
}