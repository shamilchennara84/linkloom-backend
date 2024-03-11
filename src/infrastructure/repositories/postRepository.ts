import mongoose, { Types } from "mongoose";
import postModel from "../../entities/models/postModel";
import { IPostReq, IPostRes, IPostUserRes } from "../../interfaces/Schema/postSchema";
import { ID } from "../../interfaces/common";
import { IPostRepo } from "../../interfaces/repos/postRepo";
import likeModel from "../../entities/models/likeModel";

import { ILikeCountRes } from "../../interfaces/Schema/likeSchema";
import { ICommentSchema } from "../../interfaces/Schema/commentSchema";
import commentModel from "../../entities/models/commentModel";
import { ITagRes } from "../../interfaces/Schema/tagSchema";
import tagModel from "../../entities/models/tagModel";

export class PostRepository implements IPostRepo {
  async savePost(post: IPostReq): Promise<IPostRes> {
    console.log("on post repository saving post");
    return await new postModel(post).save();
  }
  async fetchUserPosts(userId: ID): Promise<IPostRes[]> {
    return await postModel.find({ userId });
  }

  async fetchUserSavedPosts(userId: string): Promise<IPostRes[]> {
    
    return await tagModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "postDetails",
        },
      },
      {
        $project: {
          postDetails: 1,
        },
      },
    ]);
  }

  async fetchPostsExcludingUserId(userId: string): Promise<IPostUserRes[]> {
    const id = new Types.ObjectId(userId);

    const postData = await postModel.aggregate([
      { $sort: { createdAt: -1 } },
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
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "postId",
          as: "tags",
        },
      },

      {
        $addFields: {
          likeCount: { $size: "$likes" },
          likedByCurrentUser: {
            $in: [id, "$likes.userId"],
          },
          taggedByCurrentUser: {
            $in: [id, "$tags.userId"],
          },
        },
      },
    ]);
    console.log(postData);
    return postData;
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

  async tagPost(userId: string, postId: string): Promise<ITagRes | void> {
    const existingTag = await tagModel.findOne({ userId, postId });

    if (!existingTag) {
      const newTag = new tagModel({ postId, userId });
      const tagged = await newTag.save();
      if (tagged) {
        console.log("tagged");
        return {
          _id: tagged._id,
          userId: tagged.userId,
          createdAt: tagged.createdAt,
          postId: tagged.postId,
        };
      }
    } else {
      return {
        _id: existingTag._id,
        userId: existingTag.userId,
        createdAt: existingTag.createdAt,
        postId: existingTag.postId,
      };
    }
  }
  async untagPost(userId: string, postId: string): Promise<ITagRes | void> {
    const existingTag = await tagModel.findOne({ userId, postId });

    if (existingTag) {
      const untagged = await tagModel.deleteOne({ userId, postId });
      if (untagged) {
        console.log("Untagged");
        // Assuming ITagRes includes properties like _id, userId, createdAt, and postId
        return {
          _id: existingTag._id,
          userId: existingTag.userId,
          createdAt: existingTag.createdAt,
          postId: existingTag.postId,
        };
      }
    }

    return undefined;
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

  async deleteComment(commentId: string) {
    const commentDeleted = await commentModel.findByIdAndDelete(commentId);
    return commentDeleted;
  }
}
