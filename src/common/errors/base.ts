import { ErrorCodes, ErrorResponse, StatusCodes } from "../../interfaces";

export abstract class BaseError extends Error {
  public errorCode: ErrorCodes;
  public statusCode: StatusCodes;

  constructor({
    message,
    errorCode,
    statusCode,
  }: {
    message: string;
    errorCode: ErrorCodes;
    statusCode: StatusCodes;
  }) {
    super(message);

    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }

  abstract serialize(): ErrorResponse;
}
