import userModel from "../../entities/models/userModel";
import {
  IUser,
  IUserAuth,
  IUserRes,
  IUserSocialAuth,
} from "../../interfaces/Schema/userSchema";
import { ID } from "../../interfaces/common";
import { IUserRepo } from "../../interfaces/repos/userRepo";

export class UserRepository implements IUserRepo {
  async saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser> {
    console.log("on user repository saving user");
    return await new userModel(user).save();
  }

  async findById(id: string): Promise<IUser | null> {
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

  async findByUname(username: string): Promise<IUser | null> {
    return await userModel.findOne({ username });
  }

  async updateGoogleAuth(id: ID, profilePic: string | undefined) {
    try {
      const userData = await userModel.findById({ _id: id });
      if (userData) {
        userData.isGoogleAuth = true;
        if (profilePic !== undefined && !userData.profilePic)
          userData.profilePic = profilePic;
        await userData.save();
      }
    } catch (error) {
      console.log(error);
      throw Error("Error while updating google auth");
    }
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
}
