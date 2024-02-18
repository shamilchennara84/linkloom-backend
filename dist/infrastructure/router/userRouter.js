"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const multer_1 = require("../config/multer");
const userAuth_1 = require("../middleware/userAuth");
const userValidation_1 = require("../middleware/userValidation");
const validateTokenAndTempUser_ts_1 = require("../middleware/validateTokenAndTempUser.ts");
const userRouter = express_1.default.Router();
// Update the route definition to use the middleware
userRouter.post("/register", userValidation_1.userRegisterValidation, (req, res) => controllers_1.uController.userRegister(req, res));
userRouter.post("/validateOtp", validateTokenAndTempUser_ts_1.validateTokenAndTempUser, (req, res) => controllers_1.uController.validateUserOTP(req, res));
userRouter.post("/login", (req, res) => controllers_1.uController.userLogin(req, res));
userRouter.get("/get/:userId", userAuth_1.userAuth, (req, res) => controllers_1.uController.userProfile(req, res));
userRouter.put("/update/:userId", userAuth_1.userAuth, (req, res) => controllers_1.uController.updateProfile(req, res));
userRouter.patch("/update/profileimage/:userId", userAuth_1.userAuth, multer_1.upload.single("image"), (req, res) => controllers_1.uController.updateUserProfileDp(req, res));
userRouter.patch("/remove/profileimage/:userId", userAuth_1.userAuth, (req, res) => controllers_1.uController.removeUserProfileDp(req, res));
userRouter.post("/addPost", multer_1.upload.single("Image"), (req, res) => controllers_1.postController.savePost(req, res));
userRouter.get("/userPost/:userId", (req, res) => controllers_1.postController.userPosts(req, res));
userRouter.get("/homePost/:userId", (req, res) => controllers_1.postController.HomePosts(req, res));
userRouter.get("/like/:userId/:postId", (req, res) => controllers_1.postController.LikePost(req, res));
userRouter.get("/unlike/:userId/:postId", (req, res) => controllers_1.postController.UnlikePost(req, res));
userRouter.get("/comments/:postId", (req, res) => controllers_1.postController.getComments(req, res));
userRouter.post("/createcomment", (req, res) => controllers_1.postController.createComment(req, res));
userRouter
    .route("/follow/:userId")
    .get(userAuth_1.userAuth, (req, res) => controllers_1.uController.getFollowStat(req, res))
    .post(userAuth_1.userAuth, (req, res) => controllers_1.uController.followUser(req, res));
exports.default = userRouter;
// userRouter.post("/resendOtp", uController.resendOTP);
