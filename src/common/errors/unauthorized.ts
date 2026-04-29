import { BaseError } from "./base";
import { ErrorCodes, ErrorResponse, StatusCodes } from "../../interfaces";

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCodes.UNAUTHORIZED,
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }

  serialize(): ErrorResponse {
    return {
      code: this.errorCode,
      message: this.message
    };
  }
}
