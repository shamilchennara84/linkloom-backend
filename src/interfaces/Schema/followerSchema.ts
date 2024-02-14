import { ID } from "../common";

export interface IFollowerReq {
  followerUserId: ID;
  followingUserId: ID;
  isApproved: boolean;
}

export interface IFollowerRes extends IFollowerReq {
    _id:ID
}