"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
class PostController {
    constructor(postUserCase) {
        this.postUserCase = postUserCase;
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postURL = req.file ? req.file.path : ""; // multer stores the file path in req.file
                const { userId, caption, location } = req.body;
                // Create an object with the post data
                const postData = {
                    userId,
                    postURL,
                    caption,
                    location,
                    createdAt: new Date(),
                };
                // Call your use case to save the post
                const apiResponse = yield this.postUserCase.savePost(postData);
                // Respond with the saved post data
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    userPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const apiResponse = yield this.postUserCase.fetchUserPosts(userId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    userSavedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const apiResponse = yield this.postUserCase.fetchUserSavedPosts(userId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    HomePosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const apiResponse = yield this.postUserCase.fetchLatestPosts(userId);
                // Respond with the saved post data
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                // Call your use case or service to save the post
                console.log(error);
            }
        });
    }
    LikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const postId = req.params.postId;
                const apiResponse = yield this.postUserCase.likePost(userId, postId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    UnlikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const postId = req.params.postId;
                const apiResponse = yield this.postUserCase.UnlikePost(userId, postId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    TagPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const postId = req.params.postId;
                const apiResponse = yield this.postUserCase.TagPost(userId, postId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    UnTagPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const postId = req.params.postId;
                const apiResponse = yield this.postUserCase.unTagPost(userId, postId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { text: { comment }, createdAt, postId, userId, } = req.body;
                const postComment = {
                    postId,
                    userId,
                    text: comment,
                    createdAt,
                };
                const apiResponse = yield this.postUserCase.saveComment(postComment);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const apiResponse = yield this.postUserCase.getComments(postId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = req.params.commentId;
                const apiResponse = yield this.postUserCase.deleteComments(commentId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ReportPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, postId, reason } = req.body;
                const apiResponse = yield this.postUserCase.reportPost(userId, postId, reason);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.PostController = PostController;
