import { UserController } from "../adapters/controllers/userController";
import { UserUseCase } from "../useCases/userUseCase";
import { MailSender } from "../providers/MailSender";
import { GenerateOTP } from "../providers/otpGenerator";
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
import { ChatUseCase } from "../useCases/chatUseCase";
import { ChatRepository } from "../infrastructure/repositories/chatRepository";
import { ChatController } from "../adapters/controllers/chatController";
import { NotificationUseCase } from "../useCases/notificationUseCases";
import { NotificationRepository } from "../infrastructure/repositories/notificationRepository";
import { NotificationController } from "../adapters/controllers/notificaitonController";


const userRepository = new UserRepository();
const adminRepository = new AdminRepository();
const tempUserRepository = new TempUserRepository();
const jwttoken = new JWTtoken();
const encrypt = new Encrypt();
const otpGenerator = new GenerateOTP();
const mailSender = new MailSender();
const postRepository = new PostRepository();
const chatRepository = new ChatRepository();
const notificationRepository = new NotificationRepository()



const userUseCase = new UserUseCase(encrypt, jwttoken, userRepository, tempUserRepository, mailSender);
const postUseCase = new PostUseCase(postRepository);
const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwttoken);
export const chatUseCase = new ChatUseCase(chatRepository);
export const notificationUseCase = new NotificationUseCase(notificationRepository);





export const uController = new UserController(userUseCase, otpGenerator, encrypt);
export const postController = new PostController(postUseCase);
export const chatController = new ChatController(chatUseCase);
export const aController = new AdminController(adminUseCase, userUseCase);
export const notificationController = new NotificationController(notificationUseCase);
