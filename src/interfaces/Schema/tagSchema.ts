import { ID } from "../common";

export interface ITagSchema {
  postId: ID;
  userId: ID;
  createdAt: Date;
}
export interface ITagRes {
  _id: ID;
  postId: ID;
  userId: ID;
  createdAt: Date;
}
export interface ITagCountRes {
  count: number;
}
