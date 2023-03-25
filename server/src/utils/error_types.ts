import {CustomError}  from "ts-custom-error";
import {ErrorCode, PostgresErrorCode} from "./error_messages";

export class PostgresError extends CustomError {
  public code:PostgresErrorCode;
  public message:string;
  public constructor(code:PostgresErrorCode, message:string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export class HttpError extends CustomError {
  public code:ErrorCode;
  public message:string;
  public constructor(code:ErrorCode, message:string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
