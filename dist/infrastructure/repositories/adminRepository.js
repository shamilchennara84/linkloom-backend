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
exports.AdminRepository = void 0;
const adminModel_1 = require("../../entities/models/adminModel");
const userModel_1 = __importDefault(require("../../entities/models/userModel"));
const postModel_1 = __importDefault(require("../../entities/models/postModel"));
const likeModel_1 = __importDefault(require("../../entities/models/likeModel"));
const commentModel_1 = __importDefault(require("../../entities/models/commentModel"));
const reportModel_1 = __importDefault(require("../../entities/models/reportModel"));
const switchCase = {
    $switch: {
        branches: [
            { case: { $eq: ["$_id.month", 1] }, then: "January" },
            { case: { $eq: ["$_id.month", 2] }, then: "February" },
            { case: { $eq: ["$_id.month", 3] }, then: "March" },
            { case: { $eq: ["$_id.month", 4] }, then: "April" },
            { case: { $eq: ["$_id.month", 5] }, then: "May" },
            { case: { $eq: ["$_id.month", 6] }, then: "June" },
            { case: { $eq: ["$_id.month", 7] }, then: "July" },
            { case: { $eq: ["$_id.month", 8] }, then: "August" },
            { case: { $eq: ["$_id.month", 9] }, then: "September" },
            { case: { $eq: ["$_id.month", 10] }, then: "October" },
            { case: { $eq: ["$_id.month", 11] }, then: "November" },
            { case: { $eq: ["$_id.month", 12] }, then: "December" },
        ],
        default: "Unknown",
    },
};
const countperMonth = [
    {
        $group: {
            _id: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
            },
            count: { $sum: 1 },
        },
    },
    {
        $project: {
            _id: 0,
            month: "$_id.month",
            year: "$_id.year",
            count: 1,
        },
    },
];
class AdminRepository {
    findAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield adminModel_1.adminModel.findOne();
        });
    }
    findById(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield adminModel_1.adminModel.findById(adminId);
        });
    }
    findUserPerMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const userdata = yield userModel_1.default.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        totalUsers: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [{ $toString: "$_id.year" }, "-", switchCase],
                        },
                        count: "$totalUsers",
                    },
                },
            ]);
            return userdata;
        });
    }
    findUserPerYear() {
        return __awaiter(this, void 0, void 0, function* () {
            const userdata = yield userModel_1.default.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                        },
                        totalUsers: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        year: { $toString: "$_id.year" },
                        count: "$totalUsers",
                    },
                },
            ]);
            return userdata;
        });
    }
    postPerMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const [postsCount, likesCount, commentsCount] = yield Promise.all([
                this.getPostsCountByMonth(),
                this.getLikesCountByMonth(),
                this.getCommentsCountByMonth(),
            ]);
            const postData = yield this.mapToPostPerMonth(postsCount, likesCount, commentsCount);
            return postData;
        });
    }
    getPostsCountByMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const postsCount = yield postModel_1.default.aggregate(countperMonth);
            return postsCount;
        });
    }
    getLikesCountByMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const likesCount = yield likeModel_1.default.aggregate(countperMonth);
            return likesCount;
        });
    }
    getCommentsCountByMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const commentCount = yield commentModel_1.default.aggregate(countperMonth);
            return commentCount;
        });
    }
    mapToPostPerMonth(postsCount, likesCount, commentsCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const combinedCounts = {};
            [postsCount, likesCount, commentsCount].forEach((countArray) => {
                countArray.forEach((count) => {
                    const key = `${count.year}-${count.month}`;
                    if (!combinedCounts[key]) {
                        combinedCounts[key] = {
                            monthYear: `${count.year}-${count.month}`,
                            count: 0,
                            likes: 0,
                            comments: 0,
                        };
                    }
                    if (countArray === postsCount) {
                        combinedCounts[key].count += count.count;
                    }
                    else if (countArray === likesCount) {
                        combinedCounts[key].likes += count.count;
                    }
                    else if (countArray === commentsCount) {
                        combinedCounts[key].comments += count.count;
                    }
                });
            });
            const combinedCountsArray = Object.values(combinedCounts);
            combinedCountsArray.sort((a, b) => {
                const [yearA, monthA] = a.monthYear.split("-");
                const [yearB, monthB] = b.monthYear.split("-");
                if (yearA !== yearB) {
                    return yearA.localeCompare(yearB);
                }
                else {
                    return monthA.localeCompare(monthB);
                }
            });
            return combinedCountsArray;
        });
    }
    getCardData() {
        return __awaiter(this, void 0, void 0, function* () {
            const ActiveUser = yield userModel_1.default.find().countDocuments();
            const Posts = yield postModel_1.default.find().countDocuments();
            const Reports = yield reportModel_1.default.find().countDocuments();
            const DeletedUser = yield userModel_1.default.find({ isDeleted: true }).countDocuments();
            console.log(DeletedUser);
            return { ActiveUser, Posts, Reports, DeletedUser };
        });
    }
}
exports.AdminRepository = AdminRepository;
