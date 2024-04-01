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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatUseCase = void 0;
// import { get200Response, get500Response } from "infrastructure/helperFunctions/response";
const conversationModel_1 = __importDefault(require("../entities/models/conversationModel"));
const response_1 = require("../helperFunctions/response");
class ChatUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    sendMessage(chatData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedChat = yield this.chatRepository.saveChat(chatData);
                return savedChat;
            }
            catch (error) {
                throw new Error(`Error while sending message: ${error}`);
            }
        });
    }
    getConversation(members) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const memberIds = members.map((member) => member._id);
                const existingConversation = yield conversationModel_1.default.findOne({ members: { $all: members } });
                if (existingConversation) {
                    return (0, response_1.get200Response)(existingConversation);
                }
                const newConversation = new conversationModel_1.default({ members });
                const savedConversation = yield newConversation.save();
                return (0, response_1.get200Response)(savedConversation);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatHistoryItems = yield this.chatRepository.getConversations(userId);
                return (0, response_1.get200Response)(chatHistoryItems);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getFollowedUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersData = yield this.chatRepository.findAllFollowers(userId);
                return (0, response_1.get200Response)(usersData);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getChats(conversationId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatHistory = yield this.chatRepository.getChatHistory(conversationId, page, limit);
                return (0, response_1.get200Response)(chatHistory);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ChatUseCase = ChatUseCase;
