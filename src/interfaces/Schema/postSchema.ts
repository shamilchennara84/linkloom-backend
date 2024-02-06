import { ID } from "../common";

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


