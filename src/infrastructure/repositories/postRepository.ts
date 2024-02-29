import { Types } from "mongoose";
import postModel from "../../entities/models/postModel";
import { IPostReq, IPostRes, IPostUserRes } from "../../interfaces/Schema/postSchema";
import { ID } from "../../interfaces/common";
import { IPostRepo } from "../../interfaces/repos/postRepo";
import likeModel from "../../entities/models/likeModel";

import { ILikeCountRes } from "../../interfaces/Schema/likeSchema";
import { ICommentSchema } from "../../interfaces/Schema/commentSchema";
import commentModel from "../../entities/models/commentModel";

export class PostRepository implements IPostRepo {
  async savePost(post: IPostReq): Promise<IPostRes> {
    console.log("on post repository saving post");
    return await new postModel(post).save();
  }
  async fetchUserPosts(userId: ID): Promise<IPostRes[]> {
    return await postModel.find({ userId });
  }

  async fetchPostsExcludingUserId(userId: string): Promise<IPostUserRes[]> {
    const id = new Types.ObjectId(userId);

    return await postModel.aggregate([
      { $sort: { createdAt: -1 } }, // Sort by creation date, descending
      { $match: { userId: { $ne: id } } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          likedByCurrentUser: {
            $in: [id, "$likes.userId"],
          },
        },
      },
    ]);
  }

  async likePost(userId: string, postId: string): Promise<ILikeCountRes | void> {
    const postid = new Types.ObjectId(postId);
    const existingLike = await likeModel.findOne({ userId, postId });

    if (!existingLike) {
      const newLike = new likeModel({ postId, userId });
      const liked = await newLike.save();
      if (liked) {
        console.log("liked");
      }
    }

    const likeCount = await likeModel.aggregate([
      { $match: { postId: postid } },
      { $group: { _id: "$postId", count: { $sum: 1 } } },
    ]);

    return likeCount[0];
  }
  async UnlikePost(userId: string, postId: string): Promise<ILikeCountRes | void> {
    const postid = new Types.ObjectId(postId);
    const existingLike = await likeModel.findOne({ userId, postId });

    if (existingLike) {
      const Unliked = await likeModel.deleteOne({ userId, postId });
      if (Unliked) {
        console.log("Unliked");
      }
    }

    const UnlikeCount = await likeModel.aggregate([
      { $match: { postId: postid } },
      { $group: { _id: "$postId", count: { $sum: 1 } } },
    ]);

    if (UnlikeCount && UnlikeCount.length > 0) return UnlikeCount[0];
    return {
      count: 0,
    };
  }

  async addComment(postComment: ICommentSchema) {
    const newComment = new commentModel(postComment);

    const savedComment = await newComment.save();
    const response = await commentModel.aggregate([
      { $match: { _id: savedComment._id } }, // Match the specific comment by its _id
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $limit: 1 }, // Limit the result to one comment
    ]);
    return response[0];
  }

  async getAllComments(postId: string) {
    const comments = await commentModel.aggregate([
      { $match: { postId: new Types.ObjectId(postId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { createdAt: 1 } },
    ]);
    return comments;
  }
}
