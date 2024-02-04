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