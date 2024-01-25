import { ID } from "../common";

export interface ITempUserReq{
    fullname:string,
    username:string
    email:string,
    mobile:string,
    password:string,
    otp:number

}

export interface ITempUserRes extends ITempUserReq{
    _id:ID,
    expireAt:Date
}