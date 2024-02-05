import { IUser, IUserAuth, IUserRes, IUserSocialAuth } from "../Schema/userSchema";
import { ID } from "../common";


export interface IUserRepo {
  saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: ID): Promise<IUser | null>;
  findAllUser(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<IUserRes[] | []>;
  findByUname(username: string): Promise<IUser | null>;
}


