import { Schema } from "mongoose";
import { IUserRes, IUsersAndCount } from "./Schema/userSchema";

export type ID = Schema.Types.ObjectId

export interface ICoords {
  type: "Point";
  coordinates: [number, number];
}

export interface IUserAddress {
  country: string;
  state: string;
  district: string;
  city: string;
  zip: number;
}

export type AllResTypes = IUserRes | IUserRes[] | IUsersAndCount |null;

export interface IApiRes<T extends AllResTypes> {
  status: number;
  message: string;
  data: T;
}