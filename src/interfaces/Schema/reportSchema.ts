import { ID } from "../common";

export enum ContentType {
  Post = "post",
  Profile = "profile",
  Comments = "comments",
}

export interface IReportReq {
  reporterId: ID;
  contentId: ID;
  contentType: ContentType;
  reason: string;
}
export interface IReportRes extends IReportReq {
  _id: ID;
}
export interface IReportStatusRes extends IReportRes {
  createdAt: Date;
  isResolved: boolean;
}

export interface IReportsAndCount {
  reports: IReportStatusRes[];
  reportCount: number;
}
