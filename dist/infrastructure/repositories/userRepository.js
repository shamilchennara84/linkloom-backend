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
exports.UserRepository = void 0;
const userModel_1 = __importDefault(require("../../entities/models/userModel"));
const followersModel_1 = __importDefault(require("../../entities/models/followersModel"));
const followerSchema_1 = require("../../interfaces/Schema/followerSchema");
const mongoose_1 = require("mongoose");
const reportModel_1 = __importDefault(require("../../entities/models/reportModel"));
const postModel_1 = __importDefault(require("../../entities/models/postModel"));
class UserRepository {
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("on user repository saving user");
            return yield new userModel_1.default(user).save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findById(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findOne({ email });
        });
    }
    findAllUser(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(searchQuery, "i");
            return yield userModel_1.default
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
        });
    }
    getAllReportWithStatus(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regexString = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
                const regexOptions = "i"; // Case-insensitive
                return yield reportModel_1.default
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
                            reporterDetails: 0
                        },
                    },
                ])
                    .exec();
            }
            catch (error) {
                console.error("Error executing aggregation pipeline:", error);
                throw error; // Rethrow the error to handle it further up the call stack
            }
        });
    }
    findUserCount(searchQuery = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(searchQuery, "i");
            return yield userModel_1.default
                .find({
                $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }, { mobile: { $regex: regex } }],
            })
                .countDocuments()
                .exec();
        });
    }
    findReportCount(searchQuery = " ") {
        return __awaiter(this, void 0, void 0, function* () {
            const regexString = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
            const regexOptions = "i"; // Case-insensitive
            return yield reportModel_1.default
                .find({
                $or: [{ contentType: { $regex: regexString, $options: regexOptions } }],
            })
                .countDocuments()
                .exec();
        });
    }
    findByUname(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findOne({ username });
        });
    }
    blockUnblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById({ _id: userId });
                if (user !== null) {
                    user.isBlocked = !user.isBlocked;
                    yield user.save();
                }
                else {
                    throw Error("Something went wrong, userId is getting");
                }
            }
            catch (error) {
                throw Error("Error while blocking/unblocking user");
            }
        });
    }
    updateUser(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userupdatung ", user);
            const updated = yield userModel_1.default.findByIdAndUpdate({ _id: userId }, {
                fullname: user.fullname,
                mobile: user.mobile,
                dob: user.dob,
                bio: user.bio,
                visibility: user.visibility,
            }, { new: true });
            return updated;
        });
    }
    updateUserProfilePic(userId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findByIdAndUpdate({ _id: userId }, {
                $set: {
                    profilePic: fileName,
                },
            }, { new: true });
        });
    }
    removeUserProfileDp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findByIdAndUpdate({ _id: userId }, {
                $unset: {
                    profilePic: "",
                },
            }, { new: true });
        });
    }
    followUser(followData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new followersModel_1.default(followData).save();
            const id = new mongoose_1.Types.ObjectId(data.followingUserId);
            const result = yield followersModel_1.default.aggregate([
                { $match: { followingUserId: id, isApproved: true } },
                {
                    $count: "count",
                },
            ]);
            const count = result.length > 0 ? result[0].count : 0;
            return { count, status: data.isApproved === true ? followerSchema_1.FollowingStatus.following : followerSchema_1.FollowingStatus.requested };
        });
    }
    unfollowUser(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield followersModel_1.default.deleteOne({ followerUserId: userId, followingUserId: followerId });
            const followerdata = yield userModel_1.default.findById(followerId);
            const id = new mongoose_1.Types.ObjectId(followerId);
            const result = yield followersModel_1.default.aggregate([
                { $match: { followingUserId: id, isApproved: true } },
                {
                    $count: "count",
                },
            ]);
            const count = result.length > 0 ? result[0].count : 0;
            if ((followerdata === null || followerdata === void 0 ? void 0 : followerdata.visibility) === "private") {
                return { count, status: followerSchema_1.FollowingStatus.request };
            }
            else {
                return { count, status: followerSchema_1.FollowingStatus.follow };
            }
        });
    }
    followStatus(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield followersModel_1.default.findOne({
                followerUserId: userId,
                followingUserId: followerId,
            });
            const user = yield userModel_1.default.findById(followerId);
            if (user && user.visibility === "public" && !status) {
                return { status: followerSchema_1.FollowingStatus.follow };
            }
            else if (user && user.visibility === "private" && !status) {
                return { status: followerSchema_1.FollowingStatus.request };
            }
            else if (status && status.isApproved) {
                return { status: followerSchema_1.FollowingStatus.following };
            }
            else if (status && !status.isApproved) {
                return { status: followerSchema_1.FollowingStatus.requested };
            }
            return null;
        });
    }
    getProfileData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(userId);
            const result = yield userModel_1.default.aggregate([
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
        });
    }
    searchUsers(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(userId);
            const regex = new RegExp(query, "i");
            const result = yield userModel_1.default.aggregate([
                { $match: { $or: [{ username: { $regex: regex } }, { fullname: { $regex: regex } }], _id: { $ne: id } } },
                {
                    $lookup: {
                        from: "followers",
                        let: { userId: "$_id" },
                        pipeline: [{ $match: { $expr: { $eq: ["$followingUserId", "$$userId"] } } }, { $count: "followers" }],
                        as: "followersCount",
                    },
                },
                { $unwind: "$followersCount" }, // Unwind the followersCount array
                {
                    $addFields: {
                        followers: "$followersCount.followers", // Directly use the followers count
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
                        as: "isFollowing",
                    },
                },
                { $unwind: "$isFollowing" }, // Unwind the isFollowing array
                {
                    $addFields: {
                        isFollowing: "$isFollowing.isFollowing", // Directly use the isFollowing count
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
                { $unwind: "$mutualConnections" }, // Unwind the mutualConnections array
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
            result.forEach((val) => {
                console.log(val);
            });
            return result;
        });
    }
    followersList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(userId);
            console.log(id, "hello");
            return yield followersModel_1.default.aggregate([
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
        });
    }
    followingList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(userId);
            console.log(id, "hello");
            return yield followersModel_1.default.aggregate([
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
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: userId }, { $set: { isDeleted: true } }, { new: true } // This option ensures that the updated document is returned
            );
            return updatedUser;
        });
    }
    resolveReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield reportModel_1.default.findById(reportId);
            if (!report) {
                throw new Error("Report not found.");
            }
            const contentId = report.contentId;
            const post = yield postModel_1.default.findById(contentId);
            if (!post) {
                throw new Error("Post not found.");
            }
            post.isRemoved = true;
            yield post.save();
            return post;
        });
    }
}
exports.UserRepository = UserRepository;
