"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const notificationSchema_1 = require("../../interfaces/Schema/notificationSchema");
const notificationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(notificationSchema_1.NotificationType),
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Assuming there's a User model
        required: true,
    },
    relatedUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Assuming there's a User model
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post", // Assuming there's a Post model
    },
    commentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment", // Assuming there's a Comment model
    },
    isRead: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: true });
const NotificationModel = mongoose_1.default.model("Notification", notificationSchema);
exports.default = NotificationModel;
