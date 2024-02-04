import express from "express";

import { postController, uController } from "../../providers/controllers";
import { upload } from "../config/multer";

const userRouter = express.Router();

userRouter.post("/register", (req, res) => uController.userRegister(req, res));
userRouter.post("/validateOtp", (req, res) => uController.validateUserOTP(req, res));
userRouter.post("/login", (req, res) => uController.userLogin(req, res));
// userRouter.post("/resendOtp", uController.resendOTP);


userRouter.put("/update/:userId", (req, res) =>
  uController.updateProfile(req, res)
);
userRouter.patch(
  "/update/profileimage/:userId",
  upload.single("image"),
  (req, res) => uController.updateUserProfileDp(req, res)
);
userRouter.patch("/remove/profileimage/:userId",  (req, res) =>
  uController.removeUserProfileDp(req, res)
);
// userRouter.post("/addPost", upload.single("Image"), (req, res) =>postController.savePost(req, res)
);

export default userRouter;
