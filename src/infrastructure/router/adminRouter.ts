import express from "express";
const adminRouter = express.Router();
import { aController} from "../../providers/controllers";



adminRouter.post("/login", (req, res) => aController.adminLogin(req, res));
adminRouter.get("/users",  (req, res) => aController.getAllUsers(req, res));



export default adminRouter;
