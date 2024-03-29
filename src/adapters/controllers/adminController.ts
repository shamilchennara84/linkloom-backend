
import { IAdmin } from "../../interfaces/Schema/adminSchema";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { UserUseCase } from "../../useCases/userUseCase";
import { Request, Response } from "express";

export class AdminController {
  constructor(private readonly adminUseCase: AdminUseCase, private readonly userUseCase: UserUseCase) {}

  async adminLogin(req: Request, res: Response) {
    const { email, password } = req.body as IAdmin;
    const authData = await this.adminUseCase.verifyLogin(email, password);
    res.status(authData.status).json(authData);
  }

  async getAllUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const searchQuery = req.query.searchQuery as string | undefined;
    const apiResponse = await this.userUseCase.getAllUsers(page, limit, searchQuery);
    res.status(apiResponse.status).json(apiResponse);
  }

  async getAllPostReports(req: Request, res: Response) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const searchQuery = req.query.searchQuery as string | undefined;
    const apiResponse = await this.userUseCase.getPostReports(page, limit, searchQuery);
    res.status(apiResponse.status).json(apiResponse);
  }

  async blockUser(req: Request, res: Response) {
    const apiResponse = await this.userUseCase.blockUser(req.params.userId as string);
    res.status(apiResponse.status).json(apiResponse);
  }

  async resolveReport(req: Request, res: Response) {
    console.log("hello");
     const apiResponse = await this.userUseCase.resolveReport(req.params.reportId as string);
     res.status(apiResponse.status).json(apiResponse);
  }

  async newUserPerMonth(req: Request, res: Response) {
    const apiResponse = await this.adminUseCase.newUsersPerMonth();
    res.status(apiResponse.status).json(apiResponse);
  }

  async newUserperYear(req: Request, res: Response) {
    const apiResponse = await this.adminUseCase.newUsersPerYear();
    res.status(apiResponse.status).json(apiResponse);
  }
  // async postmatrixYear(req: Request, res: Response) {
  //   const apiResponse = await this.adminUseCase.postmatrixPerYear();
  //   res.status(apiResponse.status).json(apiResponse);
  // }

  async postMatrixMonth(req: Request, res: Response) {
    const apiResponse = await this.adminUseCase.postMatrixPerMonth();
    res.status(apiResponse.status).json(apiResponse);
  }
  async adminCards(req: Request, res: Response) {
    const apiResponse = await this.adminUseCase.getIAdminCardData();
    res.status(apiResponse.status).json(apiResponse);
  }
}
