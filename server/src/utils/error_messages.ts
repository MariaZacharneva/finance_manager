export enum ErrorCode {
  BadRequest = 400,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum SuccessCode {
  OK = 200,
}

export namespace ErrorString {
  export const InvalidRequestBody = "Request body is invalid";
  export const ObjectDoesNotExist = "The requested object does not exist"
  export const NotFound = "The page does not exist";
  export const DatabaseError = "Internal database error";
  export const InternalError = "Internal server error";
  export const NotEnoughRights = "Not enough rights to perform the operation";
}

export enum PostgresErrorCode {
  ForeignKeyViolation = "23503",
  UniqueViolation = "23505"
}

export namespace PostgresErrorString {
  export const UnknownError = "Unknown database error";
  export const ForeignKeyViolation = "ForeignKeyViolation: The group or category ID does not exist";
}
