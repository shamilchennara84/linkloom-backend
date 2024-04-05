import userModel from "../../entities/models/userModel";
import { IUser, IUserAuth, IUserRes, IUserSocialAuth, IUserUpdate } from "../../interfaces/Schema/userSchema";
import { ID } from "../../interfaces/common";
import { IUserRepo } from "../../interfaces/repos/userRepo";
import followerModel from "../../entities/models/followersModel";
import {
  FollowingStatus,
  IFollowCountRes,
  IFollowStatus,
  IFollowerReq,
  IFollowerRes,
  IUserSearchItem,
} from "../../interfaces/Schema/followerSchema";
import { Types } from "mongoose";
import { IReportStatusRes } from "../../interfaces/Schema/reportSchema";
import reportModel from "../../entities/models/reportModel";
import postModel from "../../entities/models/postModel";

export class UserRepository implements IUserRepo {
  async saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser> {
    console.log("on user repository saving user");
    return await new userModel(user).save();
  }

  async findById(id: ID): Promise<IUser | null> {
    return await userModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await userModel.findOne({ email });
  }

  async findAllUser(page: number, limit: number, searchQuery: string): Promise<[] | IUserRes[]> {
    const regex = new RegExp(searchQuery, "i");
    return await userModel
      .find({
        $or: [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
          { username: { $regex: regex } },
          { mobile: { $regex: regex } },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password")
      .exec();
  }

  async getAllReportWithStatus(page: number, limit: number, searchQuery: string): Promise<[] | IReportStatusRes[]> {
    try {
      const regexString = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      const regexOptions = "i"; // Case-insensitive
      return await reportModel
        .aggregate([
          {
            $match: {
              $or: [{ contentType: { $regex: regexString, $options: regexOptions } }],
            },
          },
          {
            $lookup: {
              from: "posts",
              localField: "contentId",
              foreignField: "_id",
              as: "postDetails",
            },
          },
          {
            $unwind: "$postDetails",
          },
          {
            $lookup: {
              from: "users",
              localField: "reporterId",
              foreignField: "_id",
              as: "reporterDetails",
            },
          },
          {
            $unwind: "$reporterDetails",
          },
          {
            $addFields: {
              isResolved: "$postDetails.isRemoved",
              postImg: "$postDetails.postURL",
              caption: "$postDetails.caption",
              username: "$reporterDetails.username",
              profileImg: "$reporterDetails.profilePic",
            },
          },
          {
            $skip: (page - 1) * limit,
          },
          {
            $limit: limit,
          },
          {
            $project: {
              postDetails: 0,
              reporterDetails: 0,
            },
          },
        ])
        .exec();
    } catch (error) {
      console.error("Error executing aggregation pipeline:", error);
      throw error; // Rethrow the error to handle it further up the call stack
    }
  }

  async findUserCount(searchQuery: string = ""): Promise<number> {
    const regex = new RegExp(searchQuery, "i");
    return await userModel
      .find({
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }, { mobile: { $regex: regex } }],
      })
      .countDocuments()
      .exec();
  }

  async findReportCount(searchQuery: string = " "): Promise<number> {
    const regexString = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
    const regexOptions = "i"; // Case-insensitive
    return await reportModel
      .find({
        $or: [{ contentType: { $regex: regexString, $options: regexOptions } }],
      })
      .countDocuments()
      .exec();
  }

  async findByUname(username: string): Promise<IUser | null> {
    return await userModel.findOne({ username });
  }

  async blockUnblockUser(userId: string) {
    try {
      const user = await userModel.findById({ _id: userId });
      if (user !== null) {
        user.isBlocked = !user.isBlocked;
        await user.save();
      } else {
        throw Error("Something went wrong, userId is getting");
      }
    } catch (error) {
      throw Error("Error while blocking/unblocking user");
    }
  }

  async updateUser(userId: ID, user: IUserUpdate): Promise<IUserRes | null> {
    console.log("userupdatung ", user);
    const updated = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        fullname: user.fullname,
        mobile: user.mobile,
        dob: user.dob,
        bio: user.bio,
        visibility: user.visibility,
      },
      { new: true }
    );

    return updated;
  }

  async updateUserProfilePic(userId: ID, fileName: string): Promise<IUserRes | null> {
    return await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          profilePic: fileName,
        },
      },
      { new: true }
    );
  }

  async removeUserProfileDp(userId: ID): Promise<IUserRes | null> {
    return await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        $unset: {
          profilePic: "",
        },
      },
      { new: true }
    );
  }

  async followUser(followData: IFollowerReq): Promise<IFollowCountRes | null> {
    const data: IFollowerRes = await new followerModel(followData).save();
    const id = new Types.ObjectId(data.followingUserId as unknown as string);

    const result = await followerModel.aggregate([
      { $match: { followingUserId: id, isApproved: true } },
      {
        $count: "count",
      },
    ]);

    const count = result.length > 0 ? result[0].count : 0;
    return { count, status: data.isApproved === true ? FollowingStatus.following : FollowingStatus.requested };
  }

  async unfollowUser(userId: ID, followerId: ID) {
    await followerModel.deleteOne({ followerUserId: userId, followingUserId: followerId });

    const followerdata = await userModel.findById(followerId);
    const id = new Types.ObjectId(followerId as unknown as string);

    const result = await followerModel.aggregate([
      { $match: { followingUserId: id, isApproved: true } },
      {
        $count: "count",
      },
    ]);
    const count = result.length > 0 ? result[0].count : 0;
    if (followerdata?.visibility === "private") {
      return { count, status: FollowingStatus.request };
    } else {
      return { count, status: FollowingStatus.follow };
    }
  }

  async followStatus(userId: ID, followerId: ID): Promise<IFollowStatus | null> {
    const status: IFollowerRes | null = await followerModel.findOne({
      followerUserId: userId,
      followingUserId: followerId,
    });

    const user: IUser | null = await userModel.findById(followerId);

    if (user && user.visibility === "public" && !status) {
      return { status: FollowingStatus.follow };
    } else if (user && user.visibility === "private" && !status) {
      return { status: FollowingStatus.request };
    } else if (status && status.isApproved) {
      return { status: FollowingStatus.following };
    } else if (status && !status.isApproved) {
      return { status: FollowingStatus.requested };
    }

    return null;
  }

  async getProfileData(userId: ID) {
    const id = new Types.ObjectId(userId as unknown as string);
    const result = await userModel.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "userPosts",
        },
      },
      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "followingUserId",
          as: "userFollowers",
        },
      },
      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "followerUserId",
          as: "userFollowing",
        },
      },
      {
        $addFields: {
          userFollowers: {
            $filter: {
              input: "$userFollowers",
              as: "follower",
              cond: { $eq: ["$$follower.isApproved", true] },
            },
          },
          userFollowing: {
            $filter: {
              input: "$userFollowing",
              as: "following",
              cond: { $eq: ["$$following.isApproved", true] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          fullname: 1,
          email: 1,
          bio: 1,
          password: 1,
          mobile: 1,
          dob: 1,
          isGoogleAuth: 1,
          profilePic: 1,
          isBlocked: 1,
          isPremier: 1,
          premiumExpiry: 1,
          wallet: 1,
          visibility: 1,
          coords: 1,
          address: 1,
          postsCount: { $size: "$userPosts" },
          followersCount: { $size: "$userFollowers" },
          followingCount: { $size: "$userFollowing" },
        },
      },
    ]);

    return result[0];
  }

  async searchUsers(userId: ID, query: string): Promise<IUserSearchItem[] | null> {
    const id = new Types.ObjectId(userId as unknown as string);
    const regex = new RegExp(query, "i");
    console.log("userSearch repo", id, regex);
    const result = await userModel.aggregate([
      { $match: { $or: [{ username: { $regex: regex } }, { fullname: { $regex: regex } }], _id: { $ne: id } } },
      {
        $lookup: {
          from: "followers",
          let: { userId: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: ["$followingUserId", "$$userId"] } } }, { $count: "followers" }],
          as: "followersCount",
        },
      },
      { $unwind: { path: "$followersCount", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          followers: "$followersCount.followers", // Directly use the followers count
        },
      },
      {
        $lookup: {
          from: "followers",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$followerUserId", id] }, { $eq: ["$followingUserId", "$$userId"] }],
                },
              },
            },
            { $count: "isFollowing" },
          ],
          as: "isFollowing",
        },
      },
      { $unwind: { path: "$isFollowing", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          isFollowing: { $gt: ["$isFollowing.isFollowing", 0] }, // Convert count to boolean
        },
      },
      // Calculate mutual connections
      {
        $lookup: {
          from: "followers",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$followerUserId", id] }, { $eq: ["$followingUserId", "$$userId"] }],
                },
              },
            },
            { $count: "mutualConnections" },
          ],
          as: "mutualConnections",
        },
      },
      // { $unwind: "$mutualConnections" }, // Unwind the mutualConnections array
      { $unwind: { path: "$mutualConnections", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          mutualConnections: "$mutualConnections.mutualConnections", // Directly use the mutualConnections count
        },
      },
      // Sort by mutual connections
      {
        $sort: {
          mutualConnections: -1, // Sort in descending order
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          fullname: 1, // Corrected the typo from "userfname" to "fullname"
          profilePic: 1,
          followers: 1,
          isFollowing: 1,
          mutualConnections: 1, // Include mutualConnections in the final projection
        },
      },
    ]);
    console.log(result, "result");
    result.forEach((val) => {
      console.log(val, "result");
    });
    return result;
  }

  async followersList(userId: string) {
    const id = new Types.ObjectId(userId);
    console.log(id, "hello");
    return await followerModel.aggregate([
      { $match: { followingUserId: id } },
      {
        $lookup: {
          from: "users",
          localField: "followerUserId",
          foreignField: "_id",
          as: "followerData",
        },
      },
      {
        $unwind: "$followerData",
      },
      {
        $replaceRoot: {
          newRoot: "$followerData",
        },
      },
    ]);
  }

  async followingList(userId: string) {
    const id = new Types.ObjectId(userId);
    console.log(id, "hello");
    return await followerModel.aggregate([
      { $match: { followerUserId: id } },
      {
        $lookup: {
          from: "users",
          localField: "followingUserId",
          foreignField: "_id",
          as: "followingData",
        },
      },
      {
        $unwind: "$followingData",
      },
      {
        $replaceRoot: {
          newRoot: "$followingData",
        },
      },
    ]);
  }

  async deleteUser(userId: string) {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { isDeleted: true } },
      { new: true } // This option ensures that the updated document is returned
    );
    return updatedUser;
  }

  async resolveReport(reportId: string) {
    const report = await reportModel.findById(reportId);
    if (!report) {
      throw new Error("Report not found.");
    }
    const contentId = report.contentId;

    const post = await postModel.findById(contentId);
    if (!post) {
      throw new Error("Post not found.");
    }
    post.isRemoved = true;
    await post.save();

    return post;
  }
}
