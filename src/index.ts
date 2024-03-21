import { createServer } from "./infrastructure/config/app";
import { mongoConnect } from "./infrastructure/config/db";
import http from "http";
import { setupSocketIO } from "./infrastructure/config/socketIO";



const PORT = process.env.PORT || 3000;

const app = createServer();



mongoConnect()
  .then(() => {
    if (app) {
      const server = http.createServer(app);
      setupSocketIO(server);
      server.listen(PORT, () => console.log(`Listening to PORT ${PORT}`));
    } else {
      throw Error("App is undefined");
    }
  })
  .catch((err) => console.error("Error while connecting to database:", err));
