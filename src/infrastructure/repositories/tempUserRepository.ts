
import {
  ITempUserReq,
  ITempUserRes,
} from "../../interfaces/Schema/tempUserSchema";
import { ITempUserRepo } from "../../interfaces/repos/tempUserRepo";
import { tempUserModel } from "../../entities/models/temp/tempUserModel";
import { ID } from "../../interfaces/common";


export class TempUserRepository implements ITempUserRepo {
  async saveUser(user: ITempUserReq): Promise<ITempUserRes> {
    return await tempUserModel.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          password: user.password,
          otp:user.otp,
          expireAt: Date.now(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async findByEmail(email: string): Promise<ITempUserRes | null> {
    return await tempUserModel.findOne({ email });
  }

  async findById(id: ID): Promise<ITempUserRes | null> {
    return await tempUserModel.findById(id);
  }

  async unsetOtp(id: ID): Promise<ITempUserRes | null> {
    return await tempUserModel.findByIdAndUpdate(
      { _id: id },
      { $unset: { otp: 1 } },
      { new: true }
    );
  }

  async updateOtp(id: ID,OTP:number): Promise<ITempUserRes | null> {
     const user = await tempUserModel.findByIdAndUpdate(
       id,
       {
         $set: { otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), otp: OTP },
       },
       { new: true }
     );
     return user;
  }

  async updateOtpTries(id: ID): Promise<ITempUserRes | null> {
     const user = await tempUserModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { otpTries: 1 } },{new:true}
    );
    return user
  }
}