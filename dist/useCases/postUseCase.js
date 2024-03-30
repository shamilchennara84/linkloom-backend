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
exports.PostUseCase = void 0;
const response_1 = require("../helperFunctions/response");
class PostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    savePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (post && post.postURL) {
                    const filename = post.postURL.split("\\").pop() || "";
                    post.postURL = filename;
                }
                const savedPost = yield this.postRepository.savePost(post);
                return (0, response_1.get200Response)(savedPost);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    fetchUserPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userPosts = yield this.postRepository.fetchUserPosts(userId);
                return (0, response_1.get200Response)(userPosts);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    fetchUserSavedPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userSavedPosts = yield this.postRepository.fetchUserSavedPosts(userId.toString());
                return (0, response_1.get200Response)(userSavedPosts);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    fetchLatestPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userPosts = yield this.postRepository.fetchPostsExcludingUserId(userId.toString());
                return (0, response_1.get200Response)(userPosts);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    likePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepository.likePost(userId.toString(), postId.toString());
                if (!response) {
                    throw new Error("Failed to like post");
                }
                return (0, response_1.get200Response)(response);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    UnlikePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepository.UnlikePost(userId.toString(), postId.toString());
                if (!response) {
                    throw new Error("Failed to Unlike post");
                }
                return (0, response_1.get200Response)(response);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    saveComment(postComment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepository.addComment(postComment);
                if (!response) {
                    throw new Error("Failed to add comment");
                }
                return (0, response_1.get200Response)(response);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepository.getAllComments(postId);
                if (!response) {
                    throw new Error("Failed to fetch comment");
                }
                return (0, response_1.get200Response)(response);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    deleteComments(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepository.deleteComment(commentId);
                if (!response) {
                    throw new Error("Failed to delete comment");
                }
                return (0, response_1.get200Response)(response);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    TagPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepository.tagPost(userId.toString(), postId.toString());
                if (!response) {
                    throw new Error("Failed to tag post");
                }
                return (0, response_1.get200Response)(response);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    unTagPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepository.untagPost(userId.toString(), postId.toString());
                if (!response) {
                    throw new Error("Failed to untag post");
                }
                return (0, response_1.get200Response)(response);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    reportPost(userId, postId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepository.reportPost(userId.toString(), postId.toString(), reason);
                if (!response) {
                    throw new Error("Failed to report the post");
                }
                return (0, response_1.get200Response)(response);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    PostRemovalJob() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("function called");
                this.postRepository.checkAndMarkPostsAsRemoved();
                console.log("Scheduled post removal job successfully.");
                return { success: true, message: "Scheduled post removal job successfully." };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.PostUseCase = PostUseCase;
