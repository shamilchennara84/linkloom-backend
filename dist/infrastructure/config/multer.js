"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const console_1 = require("console");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        console.log('multer working!!!!');
        (0, console_1.log)(path_1.default.join(__dirname, "../../../images"), "directory from path");
        cb(null, path_1.default.join(__dirname, "../../../images"));
    },
    filename: function (req, file, cb) {
        const name = Date.now().toString() + "-" + file.originalname.split(" ").join("-");
        cb(null, name);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
