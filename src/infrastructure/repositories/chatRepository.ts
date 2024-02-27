import ChatModel from "../../entities/models/chatModel";
import followerModel from "../../entities/models/followersModel";
import ConversationModel from "../../entities/models/conversationModel";

import { IChatHistoryItem, IChatReq, IConversationListItem } from "../../interfaces/Schema/chatSchema";
import { IUserRes } from "../../interfaces/Schema/userSchema";
import { IChatRepo } from "../../interfaces/repos/chatRepo";
import { ID } from "../../interfaces/common";
import mongoose from "mongoose";

export class ChatRepository implements IChatRepo {
  async saveChat(chatData: IChatReq): Promise<IChatHistoryItem> {
    const newChat = new ChatModel(chatData);
    const savedChat = await newChat.save();
    const chatRes = await ChatModel.aggregate([
      {
        $match: { _id: savedChat._id },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sendersInfo",
        },
      },
    ]);
    return chatRes[0];
  }
  async findAllFollowers(userId: ID): Promise<IUserRes[] | null> {
    const usersData = await followerModel.aggregate([
      {
        $match: { followerUserId: userId, isApproved: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "followingUserId",
          foreignField: "_id",
          as: "followedUser",
        },
      },
      {
        $project: {
          _id: 0,
          followedUser: 1,
        },
      },
    ]);
    // console.log(usersData,"userdata");

    if (usersData && usersData.length !== 0) {
      // console.log("usersdata", usersData[0]);
      return usersData[0].followedUser;
    } else {
      return [];
    }
  }
  async getChatHistory(conversationId: string): Promise<IChatHistoryItem[]> {
    console.log(conversationId);
    await ChatModel.updateMany({ conversationId: conversationId }, { read: true });
    const combinedData = await ChatModel.aggregate([
      {
        $match: { conversationId: new mongoose.Types.ObjectId(conversationId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sendersInfo",
        },
      },
    ]);
    // console.log(combinedData[0].sendersInfo, "comb");
    return combinedData.length > 0 ? combinedData : [];
  }

  async getConversations(userId: string): Promise<IConversationListItem[]> {
    try {
      console.log("getconversations");
      const conversations = await ConversationModel.aggregate([
        { $match: { members: { $in: [userId] } } },
        {
          $lookup: {
            from: "chats", // Assuming "chats" is the collection name for chat messages
            localField: "_id",
            foreignField: "conversationId",
            as: "chatMessages",
          },
        },
        {
          $addFields: {
            lastChat: { $arrayElemAt: ["$chatMessages", -1] },
            unreadCount: {
              $size: {
                $filter: {
                  input: "$chatMessages",
                  as: "chat",
                  cond: {
                    $and: [{ $eq: ["$$chat.read", false] }, { $eq: ["$$chat.recieverId", userId] }],
                  },
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "_id",
            as: "memberDetails",
          },
        },
        {
          $addFields: {
            otherMemberUsername: { $arrayElemAt: ["$memberDetails.username", 0] },
            otherMemberProfilePic: { $arrayElemAt: ["$memberDetails.profilePic", 0] },
          },
        },
        {
          $project: {
            members:1,
            lastChat: 1,
            unreadCount: 1,
            otherMemberUsername: 1,
            otherMemberProfilePic: 1,
          },
        },
      ]);

      console.log(conversations, "yey");

      return conversations || [];
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return []; // Return empty array in case of an error
    }
  }
}
