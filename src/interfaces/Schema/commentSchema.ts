import { ID } from "../common";

export interface ICommentSchema {
  postId:ID  
  userId: ID; 
  text: string;
  createdAt: Date;
}
