export enum ErrorCode {
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export enum SuccessCode {
  OK = 200,
}

export namespace ErrorString {
  export const InvalidRequestBody = "Request body is invalid";
  export const NotFound = "The page does not exist";
  export const InternalError = "Internal server error";
}