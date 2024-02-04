import { IPostReq } from "../../interfaces/Schema/postSchema";
import { PostUseCase } from "../../useCases/postUseCase";
import { Request, Response } from "express";

export class PostController {
  constructor(private postUserCase: PostUseCase) {}

  async savePost(req: Request, res: Response) {
    try {
      const postURL = req.file ? req.file.path : ""; // Assuming multer stores the file path in req.file

      const { userId, caption, tags, createdAt } = req.body;
      // Create an object with the post data
      const postData: IPostReq = {
        userId,
        postURL,
        caption,
        tags,
        createdAt: new Date(createdAt), // Convert createdAt to a Date object if needed
      };

      // Call your use case or service to save the post
      const savedPost = await this.postUserCase.savePost(postData);

      // Respond with the saved post data
      res.status(savedPost.status).json(savedPost);
    } catch (error) {
      console.log(error);
    }
  }
}
