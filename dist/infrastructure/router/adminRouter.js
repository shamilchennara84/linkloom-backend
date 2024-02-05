"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRouter = express_1.default.Router();
const controllers_1 = require("../../providers/controllers");
adminRouter.post("/login", (req, res) => controllers_1.aController.adminLogin(req, res));
adminRouter.get("/users", (req, res) => controllers_1.aController.getAllUsers(req, res));
adminRouter.patch("/users/block/:userId", (req, res) => controllers_1.aController.blockUser(req, res));
exports.default = adminRouter;
