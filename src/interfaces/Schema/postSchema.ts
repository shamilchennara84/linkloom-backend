import { ID } from "../common";


export interface IPostReq {
  userId: ID;
  postURL: string;
  caption: string;
  tags?: string[];
  createdAt: Date;
}


export interface IPostRes extends IPostReq  {
  _id:ID; 
}


export interface IApiPostRes {
  status: number;
  message: string;
  data: IPostRes | null;
}
