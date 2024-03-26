import { IPostReq } from "../../interfaces/Schema/postSchema";
import { ID } from "../../interfaces/common";
import { PostUseCase } from "../../useCases/postUseCase";
import { Request, Response } from "express";
import { ICommentSchema } from "../../interfaces/Schema/commentSchema";
import { RequestWithUser } from "../../infrastructure/middleware/userAuth";

export class PostController {
  constructor(private postUserCase: PostUseCase) {}

  async savePost(req: Request, res: Response) {
    try {
      const postURL = req.file ? req.file.path : ""; // multer stores the file path in req.file

      const { userId, caption, location } = req.body;
      // Create an object with the post data
      const postData: IPostReq = {
        userId,
        postURL,
        caption,
        location,
        createdAt: new Date(),
      };
      // Call your use case to save the post
      const apiResponse = await this.postUserCase.savePost(postData);

      // Respond with the saved post data
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async userPosts(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const apiResponse = await this.postUserCase.fetchUserPosts(userId);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async userSavedPosts(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const apiResponse = await this.postUserCase.fetchUserSavedPosts(userId);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async HomePosts(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const apiResponse = await this.postUserCase.fetchLatestPosts(userId);

      // Respond with the saved post data
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      // Call your use case or service to save the post
      console.log(error);
    }
  }

  async LikePost(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const postId: ID = req.params.postId as unknown as ID;
      const apiResponse = await this.postUserCase.likePost(userId, postId);

      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async UnlikePost(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const postId: ID = req.params.postId as unknown as ID;
      const apiResponse = await this.postUserCase.UnlikePost(userId, postId);

      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async TagPost(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const postId: ID = req.params.postId as unknown as ID;
      const apiResponse = await this.postUserCase.TagPost(userId, postId);

      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async UnTagPost(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const postId: ID = req.params.postId as unknown as ID;
      const apiResponse = await this.postUserCase.unTagPost(userId, postId);

      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async createComment(req: Request, res: Response) {
    try {
      const {
        text: { comment },
        createdAt,
        postId,
        userId,
      } = req.body;
      const postComment: ICommentSchema = {
        postId,
        userId,
        text: comment,
        createdAt,
      };
      const apiResponse = await this.postUserCase.saveComment(postComment);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      const postId: string = req.params.postId;
      const apiResponse = await this.postUserCase.getComments(postId);

      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteComments(req: Request, res: Response) {
    try {
      const commentId: string = req.params.commentId;
      const apiResponse = await this.postUserCase.deleteComments(commentId);

      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async ReportPost(req: RequestWithUser, res: Response) {
    try {
      const {userId,postId,reason} = req.body
      const apiResponse = await this.postUserCase.reportPost(userId, postId, reason);
      res.status(apiResponse.status).json(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }
}
