import userModel from "../../entities/models/userModel";
import {
  IUser,
  IUserAuth,
  IUserRes,
  IUserSocialAuth,
  IUserUpdate,
} from "../../interfaces/Schema/userSchema";
import { ID } from "../../interfaces/common";
import { IUserRepo } from "../../interfaces/repos/userRepo";

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

  async findAllUser(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<[] | IUserRes[]> {
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
        $or: [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
          { mobile: { $regex: regex } },
        ],
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
    return await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        fullname: user.fullname,
        mobile: user.mobile,
        dob: user.dob,
      },
      { new: true }
    );
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
}
