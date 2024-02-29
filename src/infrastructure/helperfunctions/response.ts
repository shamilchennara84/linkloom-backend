import { STATUS_CODES, ERR_MESSAGE } from "../../constants/httpStatusCodes";
import { AllResTypes, IapiResponse } from "../../interfaces/common";

export function get200Response<T extends AllResTypes>(data: T): IapiResponse<T> {
  return {
    status: STATUS_CODES.OK,
    message: "Success",
    data: data,
  };
}

export function get500Response(error: Error): IapiResponse<null> {
  console.log(error, "error 500");
  return {
    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: error.message,
    data: null,
  };
}

export function getErrorResponse(errCode: number, customMessage?: string): IapiResponse<null> {
  const message = customMessage || ERR_MESSAGE[errCode] || "Unknown Error";

  return {
    status: errCode,
    message: message,
    data: null,
  };
}
