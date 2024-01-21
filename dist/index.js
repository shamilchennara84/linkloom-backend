"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/config/app");
const db_1 = require("./infrastructure/config/db");
const PORT = process.env.PORT || 3000;
const app = (0, app_1.createServer)();
(0, db_1.mongoConnect)()
    .then(() => app === null || app === void 0 ? void 0 : app.listen(PORT, () => console.log(`listening to PORT ${PORT}`)))
    .catch((err) => console.log("error while connecting to database\n", err));
