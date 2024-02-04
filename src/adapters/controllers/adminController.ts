import { IAdmin } from "../../interfaces/Schema/adminSchema";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { UserUseCase } from "../../useCases/userUseCase";
import { Request, Response } from "express";

export class AdminController {
  constructor(
    private readonly adminUseCase: AdminUseCase,
    private readonly userUseCase: UserUseCase
  ) {}

  async adminLogin(req: Request, res: Response) {
    const { email, password } = req.body as IAdmin;
    const authData = await this.adminUseCase.verifyLogin(email, password);
    res.status(authData.status).json(authData);
  }

  async getAllUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const searchQuery = req.query.searchQuery as string | undefined;
    const apiRes = await this.userUseCase.getAllUsers(page, limit, searchQuery);
    res.status(apiRes.status).json(apiRes);
  }
}
