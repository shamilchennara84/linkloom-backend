import { ID } from "../common";

export enum FollowingStatus {
  following = "Following",
  follow = "Follow",
  request = "Request",
  requested = "Requested",
}
export interface IFollowerReq {
  followerUserId: ID;
  followingUserId: ID;
  isApproved: boolean;
}

export interface IFollowerRes extends IFollowerReq {
  _id: ID;
}
export interface IFollowCountRes {
  count: number;
  status: FollowingStatus;
}

export interface IFollowStatus {
  status: FollowingStatus;
}

export interface IUserSearchItem {
  userId: string;
  username: string;
  userfname: string;
  followers: number;
  isFollowing: boolean;
  mutualConnections: number;
}
