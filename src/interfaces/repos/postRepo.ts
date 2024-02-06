import { IPostReq,IPostRes } from "../Schema/postSchema";
import { ID } from "../common";



export interface IPostRepo {
  savePost(post: IPostReq): Promise<IPostRes>;
  fetchUserPosts(userId: ID): Promise<IPostRes[]>;
}