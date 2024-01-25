import { ID } from "./common"

export interface Jwt{
    generateAccessToken(userId:ID):string
    generateRefreshToken(userId:ID):string
}