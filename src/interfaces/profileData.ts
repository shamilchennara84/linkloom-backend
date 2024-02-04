export interface IProfileRes {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface IApiProfileRes {
  status: number;
  message: string;
  data: IProfileRes;
}
