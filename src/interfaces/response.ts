import { ErrorCodes } from "./errors";

export enum StatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  UPDATED = 200,
  DELETED = 200,
  VALIDATION_ERROR = 400,
  UNAUTHORIZED = 401,
  INVALID_CREDENTIALS = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  COMMON_ERROR = 422,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
}

export type SuccessResponse<T> = T;

export type ErrorResponse = {
  code: ErrorCodes;
  message: string;
  details?: Array<{ field: string; message: string }>;
};

export interface ApiResponse<T> {
  data?: SuccessResponse<T>;
  error?: ErrorResponse;
}
