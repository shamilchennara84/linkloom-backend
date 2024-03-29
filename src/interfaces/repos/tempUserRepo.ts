import { ITempUserReq, ITempUserRes } from "../Schema/tempUserSchema";
import { ID } from "../common";

export interface ITempUserRepo {
  saveUser(user: ITempUserReq): Promise<ITempUserRes>;
  findByEmail(email: string): Promise<ITempUserRes | null>;
  findById(id: ID): Promise<ITempUserRes | null>;
  unsetOtp(id: ID): Promise<ITempUserRes | null>;
  updateOtp(id: ID,otp:number): Promise<ITempUserRes | null>;
  updateOtpTries(id: ID): Promise<ITempUserRes | null>;
}
