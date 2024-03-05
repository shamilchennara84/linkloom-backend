import { ID } from "../common";

export interface IAdmin {
  _id: ID;
  email: string;
  password: string;
}

export interface IAdminRes {
  email: string;
}

export interface IApiAdminAuthRes {
  status: number;
  message: string;
  data: IAdminRes | null;
  accessToken: string;
  refreshToken: string;
}

export interface IUserPerMonth {
  month: string;
  count: number;
}

export interface IUserPerYear {
  year: string;
  count: number;
}

export interface IAdminCardData {
  ActiveUser: number;
  Posts: number;
  Reports: number;
  DeletedUser: number;
}
