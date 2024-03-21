import { get200Response, get500Response } from "../infrastructure/helperFunctions/response";
import { PostRepository } from "../infrastructure/repositories/postRepository";
import { IPostReq, IPostRes, IPostUserRes } from "../interfaces/Schema/postSchema";
import { IApiResponse, ID } from "../interfaces/common";
import { ILikeCountRes } from "../interfaces/Schema/likeSchema";
import { ICommentSchema } from "../interfaces/Schema/commentSchema";
import { ITagRes } from "../interfaces/Schema/tagSchema";
import {  IReportRes } from "../interfaces/Schema/reportSchema";

export class PostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async savePost(post: IPostReq): Promise<IApiResponse<IPostRes | null>> {
    try {
      if (post && post.postURL) {
        const filename = post.postURL.split("\\").pop() || "";
        post.postURL = filename;
      }
      const savedPost = await this.postRepository.savePost(post);
      return get200Response(savedPost);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async fetchUserPosts(userId: ID): Promise<IApiResponse<IPostRes[] | null>> {
    try {
      const userPosts = await this.postRepository.fetchUserPosts(userId);

      return get200Response(userPosts);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async fetchUserSavedPosts(userId: ID): Promise<IApiResponse<IPostRes[] | null>> {
    try {
      const userSavedPosts = await this.postRepository.fetchUserSavedPosts(userId.toString());

      return get200Response(userSavedPosts);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async fetchLatestPosts(userId: ID): Promise<IApiResponse<IPostUserRes[] | null>> {
    try {
      const userPosts = await this.postRepository.fetchPostsExcludingUserId(userId.toString());

      return get200Response(userPosts);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async likePost(userId: ID, postId: ID): Promise<IApiResponse<ILikeCountRes | null>> {
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
  async UnlikePost(userId: ID, postId: ID): Promise<IApiResponse<ILikeCountRes | null>> {
    try {
      const response = await this.postRepository.UnlikePost(userId.toString(), postId.toString());
      if (!response) {
        throw new Error("Failed to Unlike post");
      }
      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async saveComment(postComment: ICommentSchema): Promise<IApiResponse<ICommentSchema | null>> {
    try {
      const response = await this.postRepository.addComment(postComment);
      if (!response) {
        throw new Error("Failed to add comment");
      }
      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async getComments(postId: string) {
    try {
      const response = await this.postRepository.getAllComments(postId);
      if (!response) {
        throw new Error("Failed to fetch comment");
      }
      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
  async deleteComments(commentId: string) {
    try {
      const response = await this.postRepository.deleteComment(commentId);
      if (!response) {
        throw new Error("Failed to delete comment");
      }
      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async TagPost(userId: ID, postId: ID): Promise<IApiResponse<ITagRes | null>> {
    try {
      const response = await this.postRepository.tagPost(userId.toString(), postId.toString());
      if (!response) {
        throw new Error("Failed to tag post");
      }
      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }
  async unTagPost(userId: ID, postId: ID): Promise<IApiResponse<ITagRes | null>> {
    try {
      const response = await this.postRepository.untagPost(userId.toString(), postId.toString());
      if (!response) {
        throw new Error("Failed to untag post");
      }

      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async reportPost(userId: ID, postId: ID, reason: string): Promise<IApiResponse<IReportRes | null>> {
    try {
      const response = await this.postRepository.reportPost(userId.toString(), postId.toString(), reason);
      if (!response) {
        throw new Error("Failed to report the post");
      }

      return get200Response(response);
    } catch (error) {
      return get500Response(error as Error);
    }
  }

  async PostRemovalJob() {
    try {
      console.log("function called");
      this.postRepository.checkAndMarkPostsAsRemoved()
      console.log("Scheduled post removal job successfully.");
      return { success: true, message: "Scheduled post removal job successfully." };
    } catch (error) {
      return get500Response(error as Error);
    }
  }
}
