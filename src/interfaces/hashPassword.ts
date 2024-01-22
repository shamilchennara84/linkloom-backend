export interface HashPassword {
  encryptPassword(password: string): Promise<string>;
  comparePassword(pass: string, hashPassword: string): Promise<boolean>;
}
