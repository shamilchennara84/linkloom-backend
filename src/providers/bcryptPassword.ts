import { HashPassword } from "../interfaces/hashPassword";
import bcrypt from 'bcrypt'


export class Encrypt implements HashPassword{

     async encryptPassword(password: string): Promise<string> {
        const saltRound  = 10
        const salt = await bcrypt.genSalt(saltRound)
        const hashPassword = await bcrypt.hash(password,salt)
        return hashPassword
    }

    async comparePassword(pass: string, hashPassword: string): Promise<boolean> {
            return await bcrypt.compare(pass,hashPassword)                       
    }




}