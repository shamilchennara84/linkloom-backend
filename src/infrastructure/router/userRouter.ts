// Importing required modules and controllers
import express, { Request, Response } from "express";
import { chatController, postController, uController, notificationController } from "../../providers/controllers";
import { upload } from "../config/multer";
import { userAuth } from "../middleware/userAuth";
import { userRegisterValidation } from "../middleware/userValidation";
import { validateTokenAndTempUser } from "../middleware/validateTokenAndTempUser.ts";

// Creating an instance of express router
const userRouter = express.Router();

//User Auth Routes
userRouter.post("/register", userRegisterValidation, (req: Request, res: Response) =>
  uController.userRegister(req, res)
);
userRouter.post("/validateOtp", validateTokenAndTempUser, (req: Request, res: Response) =>
  uController.validateUserOTP(req, res)
);
userRouter.post("/login", (req: Request, res: Response) => uController.userLogin(req, res));

// User Profile Routes
userRouter.get("/get/:userId", userAuth, (req: Request, res: Response) => uController.userProfile(req, res));
userRouter.put("/update/:userId", userAuth, (req: Request, res: Response) => uController.updateProfile(req, res));
userRouter.patch("/update/profileimage/:userId", userAuth, upload.single("image"), (req: Request, res: Response) =>
  uController.updateUserProfileDp(req, res)
);
userRouter.patch("/remove/profileimage/:userId", userAuth, (req: Request, res: Response) =>
  uController.removeUserProfileDp(req, res)
);

// Post Routes
userRouter.post("/addPost", upload.single("Image"), (req: Request, res: Response) => postController.savePost(req, res));
userRouter.get("/homePost/:userId", (req: Request, res: Response) => postController.HomePosts(req, res));
userRouter.get("/userPost/:userId", (req: Request, res: Response) => postController.userPosts(req, res));
userRouter.get("/usersavedPost/:userId", (req: Request, res: Response) => postController.userSavedPosts(req, res));

// Post Like and Unlike Routes
userRouter.get("/like/:userId/:postId", (req: Request, res: Response) => postController.LikePost(req, res));
userRouter.get("/unlike/:userId/:postId", (req: Request, res: Response) => postController.UnlikePost(req, res));

//post tag and untag
userRouter.get("/tag/:userId/:postId", (req: Request, res: Response) => postController.TagPost(req, res));
userRouter.get("/untag/:userId/:postId", (req: Request, res: Response) => postController.UnTagPost(req, res));

// Comment Routes
userRouter.get("/comments/:postId", (req: Request, res: Response) => postController.getComments(req, res));
userRouter.post("/createcomment", (req: Request, res: Response) => postController.createComment(req, res));
userRouter.delete("/comments/:commentId", (req: Request, res: Response) => postController.deleteComments(req, res));

// Follow and Followed Users Routes
userRouter
  .route("/follow/:userId")
  .get(userAuth, (req: Request, res: Response) => uController.getFollowStat(req, res))
  .post(userAuth, (req: Request, res: Response) => uController.followUser(req, res));

//Conversation Users Routes
userRouter.get("/conversation/:userId", userAuth, (req: Request, res: Response) =>
  chatController.getConversation(req, res)
);
userRouter.get("/conversations/", userAuth, (req: Request, res: Response) => chatController.getConversations(req, res));
userRouter.get("/followedUsers", userAuth, (req: Request, res: Response) => chatController.getFollowedUser(req, res));
userRouter.get("/chat/history/:roomId", userAuth, (req: Request, res: Response) =>
  chatController.getChatHistory(req, res)
);

//userSearch
userRouter.get("/userSearch", userAuth, (req: Request, res: Response) => uController.userSearch(req, res));

userRouter.get("/notifications", userAuth, (req: Request, res: Response) =>
  notificationController.getAllNotification(req, res)
);
userRouter.delete("/notification/:notificationId", userAuth, (req: Request, res: Response) =>
  notificationController.deleteNotification(req, res)
);
userRouter.delete("/friendrequest/decline/:notificationId", userAuth, (req: Request, res: Response) =>
  notificationController.rejectFriendRequest(req, res)
);
userRouter.patch("/friendrequest/accept/:notificationId", userAuth, (req: Request, res: Response) =>
  notificationController.acceptFriendRequest(req, res)
);
userRouter.get("/followerUsersList/:userId", userAuth, (req: Request, res: Response) =>
  uController.getFollowerList(req, res)
);
userRouter.get("/followingUsersList/:userId", userAuth, (req: Request, res: Response) =>
  uController.getFollowingList(req, res)
);

//user delete
userRouter.delete("/", userAuth, (req: Request, res: Response) => uController.deleteUser(req, res));

//report
userRouter.post("/report", userAuth, (req: Request, res: Response) => postController.ReportPost(req, res));

export default userRouter;
