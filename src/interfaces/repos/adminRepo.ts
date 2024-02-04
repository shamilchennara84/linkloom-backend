import { IAdmin } from "../Schema/adminSchema";

export interface IAdminRepo {
  findAdmin(): Promise<IAdmin | null>;
}
