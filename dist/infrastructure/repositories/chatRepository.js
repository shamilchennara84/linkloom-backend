"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const chatModel_1 = __importDefault(require("../../entities/models/chatModel"));
const followersModel_1 = __importDefault(require("../../entities/models/followersModel"));
const conversationModel_1 = __importDefault(require("../../entities/models/conversationModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class ChatRepository {
    saveChat(chatData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChat = new chatModel_1.default(chatData);
            const savedChat = yield newChat.save();
            const chatResponse = yield chatModel_1.default.aggregate([
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
            return chatResponse[0];
        });
    }
    findAllFollowers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersData = yield followersModel_1.default.aggregate([
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
                        followedUser: {
                            $map: {
                                input: "$followedUser",
                                as: "user",
                                in: {
                                    _id: "$$user._id",
                                    username: "$$user.username",
                                    fullname: "$$user.fullname",
                                },
                            },
                        },
                    },
                },
            ]);
            if (usersData && usersData.length !== 0) {
                const followersData = usersData.map((val) => val.followedUser);
                return followersData.flat();
            }
            else {
                return [];
            }
        });
    }
    getChatHistory(conversationId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            yield chatModel_1.default.updateMany({ conversationId: conversationId }, { read: true });
            const combinedData = yield chatModel_1.default.aggregate([
                {
                    $match: { conversationId: new mongoose_1.default.Types.ObjectId(conversationId) },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "senderId",
                        foreignField: "_id",
                        as: "sendersInfo",
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
            ]);
            // console.log(combinedData);
            combinedData.reverse();
            console.log(page);
            return combinedData.length > 0 ? combinedData : [];
        });
    }
    getConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Fetching conversations...");
                const conversations = yield conversationModel_1.default.aggregate([
                    { $match: { members: { $in: [userId] } } },
                    {
                        $lookup: {
                            from: "chats",
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
                                            $and: [
                                                { $eq: ["$$chat.read", false] },
                                                { $eq: ["$$chat.recieverId", new mongoose_1.default.Types.ObjectId(userId)] },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        $addFields: {
                            membersExcludingCurrentUser: {
                                $filter: {
                                    input: "$members",
                                    as: "member",
                                    cond: { $ne: ["$$member", new mongoose_1.default.Types.ObjectId(userId)] },
                                },
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "membersExcludingCurrentUser",
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
                            members: 1,
                            lastChat: 1,
                            unreadCount: 1,
                            otherMemberUsername: 1,
                            otherMemberProfilePic: 1,
                        },
                    },
                ]);
                return conversations || [];
            }
            catch (error) {
                console.error("Error fetching conversations:", error);
                return [];
            }
        });
    }
}
exports.ChatRepository = ChatRepository;
