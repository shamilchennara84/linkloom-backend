"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/config/app");
const db_1 = require("./infrastructure/config/db");
const http_1 = __importDefault(require("http"));
const socketIO_1 = require("./infrastructure/config/socketIO");
const PORT = process.env.PORT || 3000;
const app = (0, app_1.createServer)();
(0, db_1.mongoConnect)()
    .then(() => {
    if (app) {
        const server = http_1.default.createServer(app);
        (0, socketIO_1.setupSocketIO)(server);
        server.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));
        server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                console.error(`Port ${PORT} is already in use. Please choose a different port.`);
            }
            else {
                console.error("Error starting server:", error);
            }
        });
    }
    else {
        throw Error("App is undefined");
    }
})
    .catch((err) => console.error("Error while connecting to database:", err));
