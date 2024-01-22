import { UserRepository } from "../infrastructure/repositories/userRepository";
import { User } from "../interfaces/schemaInterface";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTtoken } from "../providers/jwtToken";

export class UserUseCase {
  constructor(private encrypt: Encrypt, private JWTtoken: JWTtoken, private userRepository: UserRepository) {}

  async emailExist(email: string): Promise<boolean> {
    const userExist = await this.userRepository.findByEmail(email);
    return Boolean(userExist);
  }

  async saveUserdetails(userData: User) {
    const user = await this.userRepository.saveUser(userData);
    return user;
  }

  async verifyLogin(email: string, password: string) {
    const userData = await this.userRepository.findByEmail(email);
    if (userData !== null) {
      if (userData.isBlocked) {
        throw new Error("You are blocked by admin");
      } else {
        const passwordMatch = await this.encrypt.comparePassword(password, userData.password);
        if (passwordMatch) {
          const token = this.JWTtoken.generateToken(userData._id);
          return {
            status: 200,
            data: { userData, token },
          };
        }
      }
    } else {
      throw new Error("invalid email or password");
    }
  }
}
