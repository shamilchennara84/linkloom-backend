
import { PostRepository } from "../infrastructure/repositories/postRepository";
import { IApiPostRes, IPostReq,} from "../interfaces/Schema/postSchema";
import { STATUS_CODES } from "../constants/httpStatusCodes";




export class PostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async savePost(post: IPostReq): Promise<IApiPostRes> {
    const savedPost = await this.postRepository.savePost(post);
    console.log("post data saved, on usecase", savedPost);
    return {
      status: STATUS_CODES.OK,
      data: savedPost,
      message: "Success",
    };
  }
}