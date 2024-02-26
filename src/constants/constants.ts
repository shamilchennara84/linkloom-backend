export const OTP_TIMER = 1000 * 60 * 3;
export const MAX_OTP_TRY = 3;
// export const accessTokenExp = 1 * 30 ; // 3 hour
export const accessTokenExp = 3 * 60 * 60; // 3 hour
export const refreshTokenExp = 24 * 60 * 60; // 24 hour
// export const refreshTokenExp = 24 * 60 * 60; // 24 hour
export const tempTokenExp = 10 * 60; // 10 min

export const emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
export const passwordMinLength = 8;
export const OTPRegex = "^[1-9][0-9]{3}$";
export const ZipRegex = "^[1-9][0-9]{5}$";
export const userNameMinLength = 3;
export const userNameMaxLength = 20;
export const nameRegex = "^[a-zA-Z ]{3,20}$";
export const passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";
