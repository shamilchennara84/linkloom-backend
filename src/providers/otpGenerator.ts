import { OTP } from "../interfaces/getOTP";


export class GenerateOTP implements OTP{
    generateOTP(): number {
        return Math.floor(1000+Math.random()*9000)
    }
}