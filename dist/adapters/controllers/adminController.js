"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    constructor(adminUseCase, userUseCase) {
        this.adminUseCase = adminUseCase;
        this.userUseCase = userUseCase;
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const authData = yield this.adminUseCase.verifyLogin(email, password);
            res.status(authData.status).json(authData);
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const searchQuery = req.query.searchQuery;
            const apiResponse = yield this.userUseCase.getAllUsers(page, limit, searchQuery);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    getAllPostReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const searchQuery = req.query.searchQuery;
            const apiResponse = yield this.userUseCase.getPostReports(page, limit, searchQuery);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield this.userUseCase.blockUser(req.params.userId);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    resolveReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hello");
            const apiResponse = yield this.userUseCase.resolveReport(req.params.reportId);
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    newUserPerMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield this.adminUseCase.newUsersPerMonth();
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    newUserperYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield this.adminUseCase.newUsersPerYear();
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    // async postmatrixYear(req: Request, res: Response) {
    //   const apiResponse = await this.adminUseCase.postmatrixPerYear();
    //   res.status(apiResponse.status).json(apiResponse);
    // }
    postMatrixMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield this.adminUseCase.postMatrixPerMonth();
            res.status(apiResponse.status).json(apiResponse);
        });
    }
    adminCards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield this.adminUseCase.getIAdminCardData();
            res.status(apiResponse.status).json(apiResponse);
        });
    }
}
exports.AdminController = AdminController;
