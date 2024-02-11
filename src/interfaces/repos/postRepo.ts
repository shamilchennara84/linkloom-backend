import { ILikeCountRes } from "../Schema/likeSchema";
import { IPostReq,IPostRes } from "../Schema/postSchema";
import { ID } from "../common";



export interface IPostRepo {
  savePost(post: IPostReq): Promise<IPostRes>;
  fetchUserPosts(userId: ID): Promise<IPostRes[]>;
  fetchPostsExcludingUserId(userId: string): Promise<IPostRes[]>;
  likePost(userId: string, postId: string): Promise<ILikeCountRes | void>;
}