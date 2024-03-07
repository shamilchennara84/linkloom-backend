// Importing required modules and controllers
import express from "express";
import { chatController, postController, uController } from "../../providers/controllers";
import { upload } from "../config/multer";
import { userAuth } from "../middleware/userAuth";
import { userRegisterValidation } from "../middleware/userValidation";
import { validateTokenAndTempUser } from "../middleware/validateTokenAndTempUser.ts";


// Creating an instance of express router
const userRouter = express.Router();

//User Auth Routes
userRouter.post("/register", userRegisterValidation, (req, res) => uController.userRegister(req, res));
userRouter.post("/validateOtp", validateTokenAndTempUser, (req, res) => uController.validateUserOTP(req, res));
userRouter.post("/login", (req, res) => uController.userLogin(req, res));

// User Profile Routes
userRouter.get("/get/:userId", userAuth, (req, res) => uController.userProfile(req, res));
userRouter.put("/update/:userId", userAuth, (req, res) => uController.updateProfile(req, res));
userRouter.patch("/update/profileimage/:userId", userAuth, upload.single("image"), (req, res) =>
  uController.updateUserProfileDp(req, res)
);
userRouter.patch("/remove/profileimage/:userId", userAuth, (req, res) => uController.removeUserProfileDp(req, res));

// Post Routes
userRouter.post("/addPost", upload.single("Image"), (req, res) => postController.savePost(req, res));
userRouter.get("/homePost/:userId", (req, res) => postController.HomePosts(req, res));
userRouter.get("/userPost/:userId", (req, res) => postController.userPosts(req, res));
userRouter.get("/usersavedPost/:userId", (req, res) => postController.userSavedPosts(req, res));

// Post Like and Unlike Routes
userRouter.get("/like/:userId/:postId", (req, res) => postController.LikePost(req, res));
userRouter.get("/unlike/:userId/:postId", (req, res) => postController.UnlikePost(req, res));

//post tag and untag

userRouter.get("/tag/:userId/:postId", (req, res) => postController.TagPost(req, res));
userRouter.get("/untag/:userId/:postId", (req, res) => postController.UnTagPost(req, res));

// Comment Routes
userRouter.get("/comments/:postId", (req, res) => postController.getComments(req, res));
userRouter.post("/createcomment", (req, res) => postController.createComment(req, res));
userRouter.delete("/comments/:commentId", (req, res) => postController.deleteComments(req, res));


// Follow and Followed Users Routes
userRouter
  .route("/follow/:userId")
  .get(userAuth, (req, res) => uController.getFollowStat(req, res))
  .post(userAuth, (req, res) => uController.followUser(req, res));
  
  //Conversation Users Routes
  userRouter.get("/conversation/:userId",userAuth,(req,res)=>chatController.getConversation(req,res))
  userRouter.get("/conversations/",userAuth,(req,res)=>chatController.getConversations(req,res))
  userRouter.get("/followedUsers", userAuth, (req, res) => chatController.getFollowedUser(req, res));
  userRouter.get("/chat/history/:roomId", userAuth, (req, res) => chatController.getChatHistory(req, res));

  //usersearch 
  userRouter.get("/userSearch", userAuth, (req, res) => uController.userSearch(req, res));





export default userRouter;
