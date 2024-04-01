"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.PostRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const postModel_1 = __importDefault(require("../../entities/models/postModel"));
const likeModel_1 = __importDefault(require("../../entities/models/likeModel"));
const commentModel_1 = __importDefault(require("../../entities/models/commentModel"));
const tagModel_1 = __importDefault(require("../../entities/models/tagModel"));
const reportModel_1 = __importDefault(require("../../entities/models/reportModel"));
const node_cron_1 = __importDefault(require("node-cron"));
class PostRepository {
    savePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("on post repository saving post");
            return yield new postModel_1.default(post).save();
        });
    }
    fetchUserPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postModel_1.default.find({ userId });
        });
    }
    fetchUserSavedPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tagModel_1.default.aggregate([
                { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
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
        });
    }
    fetchPostsExcludingUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(userId);
            const postData = yield postModel_1.default.aggregate([
                { $match: { isRemoved: { $ne: true } } },
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
                        from: "comments",
                        localField: "_id",
                        foreignField: "postId",
                        as: "comments",
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
                    $lookup: {
                        from: "reports",
                        localField: "_id",
                        foreignField: "contentId",
                        as: "reports",
                    },
                },
                {
                    $addFields: {
                        likeCount: { $size: "$likes" },
                        commentCount: { $size: "$comments" },
                        likedByCurrentUser: {
                            $in: [id, "$likes.userId"],
                        },
                        taggedByCurrentUser: {
                            $in: [id, "$tags.userId"],
                        },
                        reportedByCurrentUser: {
                            $in: [id, "$reports.reporterId"],
                        },
                    },
                },
            ]);
            return postData;
        });
    }
    likePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postid = new mongoose_1.Types.ObjectId(postId);
            const existingLike = yield likeModel_1.default.findOne({ userId, postId });
            if (!existingLike) {
                const newLike = new likeModel_1.default({ postId, userId });
                const liked = yield newLike.save();
                if (liked) {
                    console.log("liked");
                }
            }
            const likeCount = yield likeModel_1.default.aggregate([
                { $match: { postId: postid } },
                { $group: { _id: "$postId", count: { $sum: 1 } } },
            ]);
            return likeCount[0];
        });
    }
    UnlikePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postid = new mongoose_1.Types.ObjectId(postId);
            const existingLike = yield likeModel_1.default.findOne({ userId, postId });
            if (existingLike) {
                const Unliked = yield likeModel_1.default.deleteOne({ userId, postId });
                if (Unliked) {
                    console.log("Unliked");
                }
            }
            const UnlikeCount = yield likeModel_1.default.aggregate([
                { $match: { postId: postid } },
                { $group: { _id: "$postId", count: { $sum: 1 } } },
            ]);
            if (UnlikeCount && UnlikeCount.length > 0)
                return UnlikeCount[0];
            return {
                count: 0,
            };
        });
    }
    tagPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingTag = yield tagModel_1.default.findOne({ userId, postId });
            if (!existingTag) {
                const newTag = new tagModel_1.default({ postId, userId });
                const tagged = yield newTag.save();
                if (tagged) {
                    return {
                        _id: tagged._id,
                        userId: tagged.userId,
                        createdAt: tagged.createdAt,
                        postId: tagged.postId,
                    };
                }
            }
            else {
                return {
                    _id: existingTag._id,
                    userId: existingTag.userId,
                    createdAt: existingTag.createdAt,
                    postId: existingTag.postId,
                };
            }
        });
    }
    untagPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingTag = yield tagModel_1.default.findOne({ userId, postId });
            if (existingTag) {
                const untagged = yield tagModel_1.default.deleteOne({ userId, postId });
                if (untagged) {
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
        });
    }
    addComment(postComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = new commentModel_1.default(postComment);
            const savedComment = yield newComment.save();
            const response = yield commentModel_1.default.aggregate([
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
        });
    }
    getAllComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield commentModel_1.default.aggregate([
                { $match: { postId: new mongoose_1.Types.ObjectId(postId) } },
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
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentDeleted = yield commentModel_1.default.findByIdAndDelete(commentId);
            return commentDeleted;
        });
    }
    reportPost(userId, postId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = new reportModel_1.default({
                reporterId: userId,
                contentId: postId,
                contentType: "post",
                reason: reason,
            });
            try {
                const savedReport = yield report.save();
                console.log("Report created successfully");
                return savedReport;
            }
            catch (error) {
                console.error("Error creating report:", error);
                throw error;
            }
        });
    }
    checkAndMarkPostsAsRemoved() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Running optimized checkAndMarkPostsAsRemoved...");
            try {
                const postsToMarkAsRemoved = yield reportModel_1.default.aggregate([
                    { $match: { contentType: "post" } },
                    { $group: { _id: "$contentId", count: { $sum: 1 } } },
                    { $match: { count: { $gte: 5 } } },
                ]);
                const bulkOps = postsToMarkAsRemoved.map((post) => ({
                    updateOne: {
                        filter: { _id: new mongoose_1.Types.ObjectId(post._id) },
                        update: { isRemoved: true },
                    },
                }));
                if (bulkOps.length > 0) {
                    yield postModel_1.default.bulkWrite(bulkOps);
                    console.log(`Marked ${bulkOps.length} posts as removed due to excessive reports.`);
                }
                else {
                    console.log("No posts marked as removed.");
                }
            }
            catch (error) {
                console.error("Error in optimized checkAndMarkPostsAsRemoved:", error);
                throw error;
            }
        });
    }
    scheduleCheckAndMarkPostsAsRemoved() {
        console.log("cron job triggering");
        node_cron_1.default.schedule("0 * * * *", () => __awaiter(this, void 0, void 0, function* () {
            console.log("cron job working");
            yield this.checkAndMarkPostsAsRemoved();
        }));
    }
}
exports.PostRepository = PostRepository;
