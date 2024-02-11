
import { get200Response, get500Response } from "../infrastructure/helperfunctions/response";
import { PostRepository } from "../infrastructure/repositories/postRepository";
import { IPostReq, IPostRes, IPostUserRes } from "../interfaces/Schema/postSchema";
import { IApiRes, ID } from "../interfaces/common";
import { ILikeCountRes } from "../interfaces/Schema/likeSchema";


export class PostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async savePost(post: IPostReq): Promise<IApiRes<IPostRes | null>> {
    try {
      // Extract the filename from the postURL before saving
      if (post && post.postURL) {
        const filename = post.postURL.split("\\").pop() || "";
        post.postURL = filename;
      }
      const savedPost = await this.postRepository.savePost(post);
      console.log("post data saved, on usecase", savedPost);
      return get200Response(savedPost);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async fetchUserPosts(userId: ID): Promise<IApiRes<IPostRes[] | null>> {
    try {
      const userPosts = await this.postRepository.fetchUserPosts(userId);
      console.log("sended the post");
      return get200Response(userPosts);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async fetchLatestPosts(userId: ID): Promise<IApiRes<IPostUserRes[] | null>> {
    try {
      const userPosts = await this.postRepository.fetchPostsExcludingUserId(userId.toString());
      console.log("sended the post");
      return get200Response(userPosts);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async likePost(userId: ID, postId: ID): Promise<IApiRes<ILikeCountRes | null>> {
    try {
      const response = await this.postRepository.likePost(userId.toString(), postId.toString());
      if (!response) {
        throw new Error("Failed to like post");
      }
      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
  async UnlikePost(userId: ID, postId: ID): Promise<IApiRes<ILikeCountRes | null>> {
    try {
      const response = await this.postRepository.UnlikePost(userId.toString(), postId.toString());
      if (!response ) {
        throw new Error("Failed to Unlike post");
      }
      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
}
