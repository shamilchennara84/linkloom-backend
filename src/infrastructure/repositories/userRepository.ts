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

  async findUserCount(searchQuery: string = ""): Promise<number> {
    const regex = new RegExp(searchQuery, "i");
    return await userModel
      .find({
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }, { mobile: { $regex: regex } }],
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
        visibility: user.visibility,
      },
      { new: true }
    );
    console.log("new data", updated);
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
    console.log(id);
    const regex = new RegExp(query, "i");
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
      {
        $addFields: {
          followers: { $arrayElemAt: ["$followersCount.followers", 0] },
        },
      },

      {
        $lookup: {
          from: "followers",
          let: { userId: id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$followerUserId", "$$userId"] }, { $eq: ["$followingUserId", "$_id"] }],
                },
              },
            },
            { $count: "isFollowing" },
          ],
          as: "isFollowing", /////////FIXME: bugggggggggg fix required
        },
      },
      {
        $addFields: {
          isFollowing: { $arrayElemAt: ["$isFollowing.isFollowing", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          userfname: "$fullname",
          profilePic: 1,
          followers: 1,
          isFollowing: 1,
        },
      },
    ]);

    result.forEach((val) => {
      console.log(val);
    });
    return result;
  }

  
}
