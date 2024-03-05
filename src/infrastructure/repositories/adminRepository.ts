import { IAdminRepo } from "../../interfaces/repos/adminRepo";
import { IAdmin, IUserPerMonth, IUserPerYear, IAdminCardData } from "../../interfaces/Schema/adminSchema";
import { adminModel } from "../../entities/models/adminModel";
import { ID } from "../../interfaces/common";
import userModel from "../../entities/models/userModel";
import { IPostPerMonth } from "../../interfaces/Schema/postSchema";
import postModel from "../../entities/models/postModel";
import likeModel from "../../entities/models/likeModel";
import commentModel from "../../entities/models/commentModel";

interface MonthCount {
  count: number;
  month: string;
  year: string;
}

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

export class AdminRepository implements IAdminRepo {
  async findAdmin(): Promise<IAdmin | null> {
    return await adminModel.findOne();
  }

  async findById(adminId: ID): Promise<IAdmin | null> {
    return await adminModel.findById(adminId);
  }

  async findUserPerMonth(): Promise<IUserPerMonth[]> {
    const userdata = await userModel.aggregate([
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
    console.log(userdata);
    return userdata;
  }

  async findUserPerYear(): Promise<IUserPerYear[]> {
    const userdata = await userModel.aggregate([
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
    console.log(userdata);
    return userdata;
  }

  async postPerMonth(): Promise<IPostPerMonth[]> {
    const [postsCount, likesCount, commentsCount] = await Promise.all([
      this.getPostsCountByMonth(),
      this.getLikesCountByMonth(),
      this.getCommentsCountByMonth(),
    ]);
    console.log(postsCount, likesCount, commentsCount);
    const postData = await this.mapToPostPerMonth(postsCount, likesCount, commentsCount);

    return postData;
  }
  async getPostsCountByMonth(): Promise<MonthCount[]> {
    const postsCount = await postModel.aggregate(countperMonth);
    console.log(postsCount);

    return postsCount;
  }

  async getLikesCountByMonth(): Promise<MonthCount[]> {
    const likesCount = await likeModel.aggregate(countperMonth);
    console.log(likesCount);

    return likesCount;
  }

  async getCommentsCountByMonth(): Promise<MonthCount[]> {
    const commentCount = await commentModel.aggregate(countperMonth);
    console.log(commentCount);
    return commentCount;
  }
  async mapToPostPerMonth(
    postsCount: MonthCount[],
    likesCount: MonthCount[],
    commentsCount: MonthCount[]
  ): Promise<IPostPerMonth[]> {
    const combinedCounts: { [key: string]: IPostPerMonth } = {};
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
        } else if (countArray === likesCount) {
          combinedCounts[key].likes += count.count;
        } else if (countArray === commentsCount) {
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
      } else {
        return monthA.localeCompare(monthB);
      }
    });

    console.log("result", combinedCountsArray);
    return combinedCountsArray;
  }

  async getCardData(): Promise<IAdminCardData> {
    const ActiveUser = await userModel.find().countDocuments();
    const Posts = await postModel.find().countDocuments();
    const Reports = 34;
    const DeletedUser = 34;

    return { ActiveUser, Posts, Reports, DeletedUser };
  }
  // async postPerYear() {
  // const postData = await postModel.aggregate([]);
  // : Promise<IPostPerYear[]>
  // return postData
  //   console.log("hello");
  // }
}
