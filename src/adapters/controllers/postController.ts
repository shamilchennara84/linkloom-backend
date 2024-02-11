
import { IPostReq } from "../../interfaces/Schema/postSchema";
import { ID } from "../../interfaces/common";
import { PostUseCase } from "../../useCases/postUseCase";
import { Request, Response } from "express";

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
      const apiRes = await this.postUserCase.savePost(postData);

      // Respond with the saved post data
      res.status(apiRes.status).json(apiRes);
    } catch (error) {
      console.log(error);
    }
  }

  async userPosts(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const apiRes = await this.postUserCase.fetchUserPosts(userId);
      // Respond with the saved post data
      res.status(apiRes.status).json(apiRes);
    } catch (error) {
      // Call your use case or service to save the post
      console.log(error);
    }
  }
  async HomePosts(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const apiRes = await this.postUserCase.fetchLatestPosts(userId);

      // Respond with the saved post data
      res.status(apiRes.status).json(apiRes);
    } catch (error) {
      // Call your use case or service to save the post
      console.log(error);
    }
  }

  async LikePost(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const postId: ID = req.params.postId as unknown as ID;
      const apiRes = await this.postUserCase.likePost(userId, postId);

      res.status(apiRes.status).json(apiRes);
    } catch (error) {
      console.log(error);
    }
  }
  async UnlikePost(req: Request, res: Response) {
    try {
      const userId: ID = req.params.userId as unknown as ID;
      const postId: ID = req.params.postId as unknown as ID;
      const apiRes = await this.postUserCase.UnlikePost(userId, postId);

      res.status(apiRes.status).json(apiRes);
    } catch (error) {
      console.log(error);
    }
  }
}
