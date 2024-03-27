import express, { Request, Response } from "express";
const adminRouter = express.Router();
import { aController } from "../../providers/controllers";

adminRouter.post("/login", (req: Request, res: Response) => aController.adminLogin(req, res));
adminRouter.get("/users", (req: Request, res: Response) => aController.getAllUsers(req, res));
adminRouter.get("/reports", (req: Request, res: Response) => aController.getAllPostReports(req, res));
adminRouter.patch("/reports/resolve/:reportId", (req: Request, res: Response) => aController.resolveReport(req, res));
adminRouter.patch("/users/block/:userId", (req: Request, res: Response) => aController.blockUser(req, res));
adminRouter.get("/newUserPerMonth", (req: Request, res: Response) => aController.newUserPerMonth(req, res));
adminRouter.get("/newuserperyear", (req: Request, res: Response) => aController.newUserperYear(req, res));
adminRouter.get("/postpermonth", (req: Request, res: Response) => aController.postMatrixMonth(req, res));
adminRouter.get("/admincards", (req: Request, res: Response) => aController.adminCards(req, res));

export default adminRouter;
