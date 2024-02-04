import { IPostReq,IPostRes } from "../Schema/postSchema";



export interface IPostRepo {
  savePost(post: IPostReq): Promise<IPostRes>;
  // getPosts(userId?: string): Promise<IPostRes[]>;
}