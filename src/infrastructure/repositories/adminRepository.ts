import { IAdminRepo } from "../../interfaces/repos/adminRepo";
import { IAdmin } from "../../interfaces/Schema/adminSchema";
import { adminModel } from "../../entities/models/adminModel";
import { ID } from "../../interfaces/common";

export class AdminRepository implements IAdminRepo {
    async findAdmin(): Promise<IAdmin | null> {
        return await adminModel.findOne()
    }

    async findById(adminId: ID): Promise<IAdmin | null> {
        return await adminModel.findById(adminId)
    }
}