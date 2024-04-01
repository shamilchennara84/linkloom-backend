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
exports.ChatController = void 0;
class ChatController {
    constructor(chatUseCase) {
        this.chatUseCase = chatUseCase;
    }
    getFollowedUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userid;
                const apiResponse = yield this.chatUseCase.getFollowedUsers(userId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userid;
                const secondUserId = req.params.userId;
                const apiResponse = yield this.chatUseCase.getConversation([userId, secondUserId]);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userid;
                const apiResponse = yield this.chatUseCase.getConversations(userId);
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getChatHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getting chat history");
                const { page = 1, limit = 10 } = req.query; // Default values for page and limit
                const conversationId = req.params.roomId;
                const apiResponse = yield this.chatUseCase.getChats(conversationId, parseInt(page), parseInt(limit));
                res.status(apiResponse.status).json(apiResponse);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.ChatController = ChatController;
