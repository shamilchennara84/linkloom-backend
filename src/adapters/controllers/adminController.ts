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

  async blockUser(req: Request, res: Response) {
    const apiResponse = await this.userUseCase.blockUser(req.params.userId as string);
    res.status(apiResponse.status).json(apiResponse);
  }

  async newUserperMonth(req: Request, res: Response) {
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

  async postmatrixMonth(req: Request, res: Response) {
    const apiResponse = await this.adminUseCase.postmatrixPerMonth();
    res.status(apiResponse.status).json(apiResponse);
  }
  async adminCards(req: Request, res: Response) {
    const apiResponse = await this.adminUseCase.getadminCardData();
    res.status(apiResponse.status).json(apiResponse);
  }
}
