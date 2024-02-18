import express from "express";
import { postController, uController } from "../../providers/controllers";
import { upload } from "../config/multer";
import { userAuth } from "../middleware/userAuth";
import { userRegisterValidation } from "../middleware/userValidation";
import { validateTokenAndTempUser } from "../middleware/validateTokenAndTempUser.ts";

const userRouter = express.Router();

// Update the route definition to use the middleware
userRouter.post("/register", userRegisterValidation, (req, res) => uController.userRegister(req, res));
userRouter.post("/validateOtp", validateTokenAndTempUser, (req, res) => uController.validateUserOTP(req, res));
userRouter.post("/login", (req, res) => uController.userLogin(req, res));
userRouter.get("/get/:userId", userAuth, (req, res) => uController.userProfile(req, res));
userRouter.put("/update/:userId", userAuth, (req, res) => uController.updateProfile(req, res));
userRouter.patch("/update/profileimage/:userId", userAuth, upload.single("image"), (req, res) =>
  uController.updateUserProfileDp(req, res)
);
userRouter.patch("/remove/profileimage/:userId", userAuth, (req, res) => uController.removeUserProfileDp(req, res));


userRouter.post("/addPost", upload.single("Image"), (req, res) => postController.savePost(req, res));
userRouter.get("/userPost/:userId", (req, res) => postController.userPosts(req, res));
userRouter.get("/homePost/:userId", (req, res) => postController.HomePosts(req, res));

userRouter.get("/like/:userId/:postId", (req, res) => postController.LikePost(req, res));
userRouter.get("/unlike/:userId/:postId", (req, res) => postController.UnlikePost(req, res));
userRouter.get("/comments/:postId", (req, res) => postController.getComments(req, res));
userRouter.post("/createcomment", (req, res) => postController.createComment(req, res));


userRouter
  .route("/follow/:userId")
  .get(userAuth, (req, res) => uController.getFollowStat(req, res))
  .post(userAuth, (req, res) => uController.followUser(req, res))
export default userRouter;

// userRouter.post("/resendOtp", uController.resendOTP);
