import { STATUS_CODES, ERR_MESSAGE } from "../constants/httpStatusCodes";
import { AllResTypes, IApiResponse } from "../interfaces/common";

export const get200Response = <T extends AllResTypes>(data: T): IApiResponse<T> => {
  return {
    status: STATUS_CODES.OK,
    message: "Success",
    data: data,
  };
};

export const get500Response = (error: Error): IApiResponse<null> => {
  console.log(error, "error 500");
  return {
    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: error.message,
    data: null,
  };
};

export const getErrorResponse = (errCode: number, customMessage?: string): IApiResponse<null> => {
  const message = customMessage || ERR_MESSAGE[errCode] || "Unknown Error";

  return {
    status: errCode,
    message: message,
    data: null,
  };
};
