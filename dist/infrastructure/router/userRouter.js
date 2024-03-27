"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing required modules and controllers
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const multer_1 = require("../config/multer");
const userAuth_1 = require("../middleware/userAuth");
const userValidation_1 = require("../middleware/userValidation");
const validateTokenAndTempUser_ts_1 = require("../middleware/validateTokenAndTempUser.ts");
// Creating an instance of express router
const userRouter = express_1.default.Router();
//User Auth Routes
userRouter.post("/register", userValidation_1.userRegisterValidation, (req, res) => controllers_1.uController.userRegister(req, res));
userRouter.post("/validateOtp", validateTokenAndTempUser_ts_1.validateTokenAndTempUser, (req, res) => controllers_1.uController.validateUserOTP(req, res));
userRouter.post("/login", (req, res) => controllers_1.uController.userLogin(req, res));
// User Profile Routes
userRouter.get("/get/:userId", userAuth_1.userAuth, (req, res) => controllers_1.uController.userProfile(req, res));
userRouter.put("/update/:userId", userAuth_1.userAuth, (req, res) => controllers_1.uController.updateProfile(req, res));
userRouter.patch("/update/profileimage/:userId", userAuth_1.userAuth, multer_1.upload.single("image"), (req, res) => controllers_1.uController.updateUserProfileDp(req, res));
userRouter.patch("/remove/profileimage/:userId", userAuth_1.userAuth, (req, res) => controllers_1.uController.removeUserProfileDp(req, res));
// Post Routes
userRouter.post("/addPost", multer_1.upload.single("Image"), (req, res) => controllers_1.postController.savePost(req, res));
userRouter.get("/homePost/:userId", (req, res) => controllers_1.postController.HomePosts(req, res));
userRouter.get("/userPost/:userId", (req, res) => controllers_1.postController.userPosts(req, res));
userRouter.get("/usersavedPost/:userId", (req, res) => controllers_1.postController.userSavedPosts(req, res));
// Post Like and Unlike Routes
userRouter.get("/like/:userId/:postId", (req, res) => controllers_1.postController.LikePost(req, res));
userRouter.get("/unlike/:userId/:postId", (req, res) => controllers_1.postController.UnlikePost(req, res));
//post tag and untag
userRouter.get("/tag/:userId/:postId", (req, res) => controllers_1.postController.TagPost(req, res));
userRouter.get("/untag/:userId/:postId", (req, res) => controllers_1.postController.UnTagPost(req, res));
// Comment Routes
userRouter.get("/comments/:postId", (req, res) => controllers_1.postController.getComments(req, res));
userRouter.post("/createcomment", (req, res) => controllers_1.postController.createComment(req, res));
userRouter.delete("/comments/:commentId", (req, res) => controllers_1.postController.deleteComments(req, res));
// Follow and Followed Users Routes
userRouter
    .route("/follow/:userId")
    .get(userAuth_1.userAuth, (req, res) => controllers_1.uController.getFollowStat(req, res))
    .post(userAuth_1.userAuth, (req, res) => controllers_1.uController.followUser(req, res));
//Conversation Users Routes
userRouter.get("/conversation/:userId", userAuth_1.userAuth, (req, res) => controllers_1.chatController.getConversation(req, res));
userRouter.get("/conversations/", userAuth_1.userAuth, (req, res) => controllers_1.chatController.getConversations(req, res));
userRouter.get("/followedUsers", userAuth_1.userAuth, (req, res) => controllers_1.chatController.getFollowedUser(req, res));
userRouter.get("/chat/history/:roomId", userAuth_1.userAuth, (req, res) => controllers_1.chatController.getChatHistory(req, res));
//userSearch
userRouter.get("/userSearch", userAuth_1.userAuth, (req, res) => controllers_1.uController.userSearch(req, res));
userRouter.get("/notifications", userAuth_1.userAuth, (req, res) => controllers_1.notificationController.getAllNotification(req, res));
userRouter.delete("/notification/:notificationId", userAuth_1.userAuth, (req, res) => controllers_1.notificationController.deleteNotification(req, res));
userRouter.delete("/friendrequest/decline/:notificationId", userAuth_1.userAuth, (req, res) => controllers_1.notificationController.rejectFriendRequest(req, res));
userRouter.patch("/friendrequest/accept/:notificationId", userAuth_1.userAuth, (req, res) => controllers_1.notificationController.acceptFriendRequest(req, res));
userRouter.get("/followerUsersList/:userId", userAuth_1.userAuth, (req, res) => controllers_1.uController.getFollowerList(req, res));
userRouter.get("/followingUsersList/:userId", userAuth_1.userAuth, (req, res) => controllers_1.uController.getFollowingList(req, res));
//user delete
userRouter.delete("/", userAuth_1.userAuth, (req, res) => controllers_1.uController.deleteUser(req, res));
//report
userRouter.post("/report", userAuth_1.userAuth, (req, res) => controllers_1.postController.ReportPost(req, res));
exports.default = userRouter;
