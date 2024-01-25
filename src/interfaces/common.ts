import { Schema } from "mongoose";

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