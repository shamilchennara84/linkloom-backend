import express from "express";

import { uController } from "../../providers/controllers";
import { upload } from "../config/multer";
import { userAuth } from "../middleware/userAuth";

const userRouter = express.Router();

userRouter.post("/register", (req, res) => uController.userRegister(req, res));
userRouter.post("/validateOtp", (req, res) => uController.validateUserOTP(req, res));
userRouter.post("/login", (req, res) => uController.userLogin(req, res));
// userRouter.post("/resendOtp", uController.resendOTP);

userRouter.put("/update/:userId",userAuth, (req, res) => uController.updateProfile(req, res));
userRouter.patch(
  "/update/profileimage/:userId",
  userAuth,
  upload.single("image"),
  (req, res) => uController.updateUserProfileDp(req, res)
);
userRouter.patch("/remove/profileimage/:userId", userAuth, (req, res) =>
  uController.removeUserProfileDp(req, res)
);
// userRouter.post("/addPost", upload.single("Image"), (req, res) =>postController.savePost(req, res)

export default userRouter;
