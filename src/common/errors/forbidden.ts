import { BaseError } from "./base";
import { ErrorCodes, ErrorResponse, StatusCodes } from "../../interfaces";

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCodes.FORBIDDEN,
      statusCode: StatusCodes.FORBIDDEN
    });
  }

  serialize(): ErrorResponse {
    return {
      code: this.errorCode,
      message: this.message,
    };
  }
}
