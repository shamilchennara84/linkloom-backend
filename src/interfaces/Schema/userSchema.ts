import { ICoords, ID, IUserAddress } from "../common";


//Interface for userSchema
export interface IUser {
  _id: ID;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  mobile: string;
  dob?: Date; // need to check
  isGoogleAuth: boolean;
  profilePic: string;
  isBlocked: boolean;
  isPremier: boolean;
  premiumExpiry?: Date;
  wallet?: number | null;
  visibility: "public" | "private";
  coords?: ICoords;
  address?: IUserAddress;

}

export interface IUserRes extends IUser {}

export interface IUserUpdate
  extends Omit<
    IUserRes,
    "_id" | "email" | "password" | "isBlocked" | 'username' | 'isGoogleAuth' | 'isPremier' 
  > {}
export interface IUserChatSearch
  extends Omit<
    IUserRes,
    | "email"
    | "password"
    | "isBlocked"
    | "isGoogleAuth"
    | "isPremier"
    | "dob"
    | "mobile"
    | "premiumExpiry"
    | "wallet"
    | "visibility"
    | "coords"
    | "address"
  > {}

// for social auth credentials
export interface IUserSocialAuth {
    fullname: string
    email: string
    profilePic?: string
}

// auth credentials
export interface IUserAuth {
    fullname: string
    username:string
    email: string
    mobile:string
    password: string
}

// api response for single user as data
export interface IUserProfileData extends IUserRes {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

// api response for single user as data
export interface IApiUserProfileRes {
  status: number;
  message: string;
  data: IUserProfileData | null;
}
export interface IApiUserRes {
  status: number;
  message: string;
  data: IUser | null;
}

export interface IApiUserAuthRes extends IApiUserRes {
    accessToken: string
    refreshToken: string
}

// api response for multiple users as data
export interface IApiUsersRes {
    status: number
    message: string
    data: IUserRes[] | null
}

export interface IUsersAndCount {
    users: IUserRes[],
    userCount: number
}


