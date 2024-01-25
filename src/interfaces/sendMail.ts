export interface ISendOTP {
  sendOTP(email: string,name:string, otp: number): void;
}
