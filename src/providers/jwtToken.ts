import jwt from "jsonwebtoken";
import { Jwt } from "../interfaces/jwt";

export class JWTtoken implements Jwt{

generateToken(userId: string): string {
    const KEY = process.env.JWT_SECRET;
    if(KEY!==undefined){
        return jwt.sign({userId},KEY)
    }
    throw new Error ("JWT key is not defined")
}


}