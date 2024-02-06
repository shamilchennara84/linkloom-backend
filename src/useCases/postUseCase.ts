import { get200Response, get500Response } from "../infrastructure/helperfunctions/response";
import { PostRepository } from "../infrastructure/repositories/postRepository";
import { IPostReq, IPostRes } from "../interfaces/Schema/postSchema";
import { IApiRes } from "../interfaces/common";

export class PostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async savePost(post: IPostReq): Promise<IApiRes<IPostRes | null>> {
    try {
      const savedPost = await this.postRepository.savePost(post);
      console.log("post data saved, on usecase", savedPost);
      return get200Response(savedPost);
    } catch (error) {
      return get500Response(error as Error);
    }
  }


//  async fetchUserPosts(userId: ID): Promise<IPostRes[]> {

// }

}