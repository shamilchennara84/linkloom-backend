import postModel from "../../entities/models/postModel";
import { IPostReq, IPostRes } from "../../interfaces/Schema/postSchema";
import { IPostRepo } from "../../interfaces/repos/postRepo";
// import { ID } from "../../interfaces/common";



export class PostRepository implements IPostRepo{
    async savePost(post: IPostReq): Promise<IPostRes> {
         console.log("on post repository saving post");
        return await new postModel(post).save()
         

    }


    // getPosts(userId?: string | undefined): Promise<IPostRes[]> {
        
    // }
    
}