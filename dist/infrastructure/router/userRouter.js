"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _controllers = require("../../providers/controllers");
var _multer = require("../config/multer");
var _userAuth = require("../middleware/userAuth");
var _userValidation = require("../middleware/userValidation");
var _validateTokenAndTempUser = require("../middleware/validateTokenAndTempUser.ts");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// Importing required modules and controllers

// Creating an instance of express router
var userRouter = _express["default"].Router();

//User Auth Routes
userRouter.post("/register", _userValidation.userRegisterValidation, function (req, res) {
  return _controllers.uController.userRegister(req, res);
});
userRouter.post("/validateOtp", _validateTokenAndTempUser.validateTokenAndTempUser, function (req, res) {
  return _controllers.uController.validateUserOTP(req, res);
});
userRouter.post("/login", function (req, res) {
  return _controllers.uController.userLogin(req, res);
});

// User Profile Routes
userRouter.get("/get/:userId", _userAuth.userAuth, function (req, res) {
  return _controllers.uController.userProfile(req, res);
});
userRouter.put("/update/:userId", _userAuth.userAuth, function (req, res) {
  return _controllers.uController.updateProfile(req, res);
});
userRouter.patch("/update/profileimage/:userId", _userAuth.userAuth, _multer.upload.single("image"), function (req, res) {
  return _controllers.uController.updateUserProfileDp(req, res);
});
userRouter.patch("/remove/profileimage/:userId", _userAuth.userAuth, function (req, res) {
  return _controllers.uController.removeUserProfileDp(req, res);
});

// Post Routes
userRouter.post("/addPost", _multer.upload.single("Image"), function (req, res) {
  return _controllers.postController.savePost(req, res);
});
userRouter.get("/homePost/:userId", function (req, res) {
  return _controllers.postController.HomePosts(req, res);
});
userRouter.get("/userPost/:userId", function (req, res) {
  return _controllers.postController.userPosts(req, res);
});
userRouter.get("/usersavedPost/:userId", function (req, res) {
  return _controllers.postController.userSavedPosts(req, res);
});

// Post Like and Unlike Routes
userRouter.get("/like/:userId/:postId", function (req, res) {
  return _controllers.postController.LikePost(req, res);
});
userRouter.get("/unlike/:userId/:postId", function (req, res) {
  return _controllers.postController.UnlikePost(req, res);
});

//post tag and untag
userRouter.get("/tag/:userId/:postId", function (req, res) {
  return _controllers.postController.TagPost(req, res);
});
userRouter.get("/untag/:userId/:postId", function (req, res) {
  return _controllers.postController.UnTagPost(req, res);
});

// Comment Routes
userRouter.get("/comments/:postId", function (req, res) {
  return _controllers.postController.getComments(req, res);
});
userRouter.post("/createcomment", function (req, res) {
  return _controllers.postController.createComment(req, res);
});
userRouter["delete"]("/comments/:commentId", function (req, res) {
  return _controllers.postController.deleteComments(req, res);
});

// Follow and Followed Users Routes
userRouter.route("/follow/:userId").get(_userAuth.userAuth, function (req, res) {
  return _controllers.uController.getFollowStat(req, res);
}).post(_userAuth.userAuth, function (req, res) {
  return _controllers.uController.followUser(req, res);
});

//Conversation Users Routes
userRouter.get("/conversation/:userId", _userAuth.userAuth, function (req, res) {
  return _controllers.chatController.getConversation(req, res);
});
userRouter.get("/conversations/", _userAuth.userAuth, function (req, res) {
  return _controllers.chatController.getConversations(req, res);
});
userRouter.get("/followedUsers", _userAuth.userAuth, function (req, res) {
  return _controllers.chatController.getFollowedUser(req, res);
});
userRouter.get("/chat/history/:roomId", _userAuth.userAuth, function (req, res) {
  return _controllers.chatController.getChatHistory(req, res);
});

//userSearch
userRouter.get("/userSearch", _userAuth.userAuth, function (req, res) {
  return _controllers.uController.userSearch(req, res);
});
userRouter.get("/notifications", _userAuth.userAuth, function (req, res) {
  return _controllers.notificationController.getAllNotification(req, res);
});
userRouter["delete"]("/notification/:notificationId", _userAuth.userAuth, function (req, res) {
  return _controllers.notificationController.deleteNotification(req, res);
});
userRouter["delete"]("/friendrequest/decline/:notificationId", _userAuth.userAuth, function (req, res) {
  return _controllers.notificationController.rejectFriendRequest(req, res);
});
userRouter.patch("/friendrequest/accept/:notificationId", _userAuth.userAuth, function (req, res) {
  return _controllers.notificationController.acceptFriendRequest(req, res);
});
userRouter.get("/followerUsersList/:userId", _userAuth.userAuth, function (req, res) {
  return _controllers.uController.getFollowerList(req, res);
});
userRouter.get("/followingUsersList/:userId", _userAuth.userAuth, function (req, res) {
  return _controllers.uController.getFollowingList(req, res);
});

//user delete
userRouter["delete"]("/", _userAuth.userAuth, function (req, res) {
  return _controllers.uController.deleteUser(req, res);
});

//report
userRouter.post("/report", _userAuth.userAuth, function (req, res) {
  return _controllers.postController.ReportPost(req, res);
});
var _default = exports["default"] = userRouter;