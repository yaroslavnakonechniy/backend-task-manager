import { BaseError } from "./base";
import { ErrorCodes, ErrorResponse, StatusCodes } from "../../interfaces";

export class InvalidCredentialsError extends BaseError {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCodes.INVALID_CREDENTIALS,
      statusCode: StatusCodes.INVALID_CREDENTIALS
    });
  }

  serialize(): ErrorResponse {
    return {
      code: this.errorCode,
      message: this.message,
    };
  }
}
