import { IUser, IUserAuth, IUserRes, IUserSocialAuth } from "../Schema/userSchema";


export interface IUserRepo {
  saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findAllUser(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<IUserRes[] | []>;
  findByUname(username: string): Promise<IUser | null>;
}


