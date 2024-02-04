import { UserController } from "../adapters/controllers/userController";
import { UserUseCase } from "../useCases/userUseCase";
import { MailSender } from "../providers/MailSender";
import { GenerateOTP } from "../providers/otpGenerator"
import { Encrypt } from "../providers/bcryptPassword";
import { JWTtoken } from "../providers/jwtToken";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository";
import { PostRepository } from "../infrastructure/repositories/postRepository";
import { PostController } from "../adapters/controllers/postController";
import { PostUseCase } from "../useCases/postUseCase";
import { AdminController } from "../adapters/controllers/adminController";
import { AdminUseCase } from "../useCases/adminUseCase";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";


const userRepository = new UserRepository();
const adminRepository = new AdminRepository()
const tempUserRepository = new TempUserRepository()
const jwttoken = new JWTtoken();
const encrypt = new Encrypt();
const otpGenerator = new GenerateOTP();
const mailSender = new MailSender();
const postRepository = new PostRepository
const userUseCase = new UserUseCase(encrypt, jwttoken, userRepository,tempUserRepository,mailSender);
const postUseCase = new PostUseCase(postRepository)
const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwttoken);


export const uController = new UserController(userUseCase, mailSender, otpGenerator, encrypt);
export const postController = new PostController(postUseCase)
export const aController = new AdminController(adminUseCase,userUseCase,)