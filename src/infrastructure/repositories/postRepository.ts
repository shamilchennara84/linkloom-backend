import postModel from "../../entities/models/postModel";
import { IPostReq, IPostRes } from "../../interfaces/Schema/postSchema";
import { ID } from "../../interfaces/common";
import { IPostRepo } from "../../interfaces/repos/postRepo";
// import { ID } from "../../interfaces/common";

export class PostRepository implements IPostRepo {
  async fetchUserPosts(userId: ID): Promise<IPostRes[]> {
    return await postModel.find({ userId });
  }

  async savePost(post: IPostReq): Promise<IPostRes> {
    console.log("on post repository saving post");
    return await new postModel(post).save();
  }

  // getPosts(userId?: string | undefined): Promise<IPostRes[]> {

  // }
}
