import express from "express";
const adminRouter = express.Router();
import { aController } from "../../providers/controllers";

adminRouter.post("/login", (req, res) => aController.adminLogin(req, res));
adminRouter.get("/users", (req, res) => aController.getAllUsers(req, res));
adminRouter.get("/reports", (req, res) => aController.getAllPostReports(req, res));
adminRouter.patch("/reports/resolve/:reportId", (req, res) => aController.resolveReport(req, res));
adminRouter.patch("/users/block/:userId", (req, res) => aController.blockUser(req, res));
adminRouter.get("/newUserPerMonth", (req, res) => aController.newUserPerMonth(req, res));
adminRouter.get("/newuserperyear", (req, res) => aController.newUserperYear(req, res));
adminRouter.get("/postpermonth", (req, res) => aController.postMatrixMonth(req, res));
adminRouter.get("/admincards", (req, res) => aController.adminCards(req, res));

export default adminRouter;
