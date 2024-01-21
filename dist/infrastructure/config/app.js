"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const adminRouter_1 = __importDefault(require("../router/adminRouter"));
const userRouter_1 = __importDefault(require("../router/userRouter"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
        app.use((0, cors_1.default)({
            credentials: true,
            origin: process.env.CORS_URI,
        }));
        app.use("/api/admin", adminRouter_1.default);
        app.use("/api/user", userRouter_1.default);
        return app;
    }
    catch (error) {
        const err = error;
        console.log(err.message);
    }
};
exports.createServer = createServer;
