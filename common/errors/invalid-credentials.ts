import { BaseError } from "./base";
import { ErrorCodes, IErrorResponse, StatusCodes } from "../../interfaces";

export class InvalidCredentialsError extends BaseError {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCodes.INVALID_CREDENTIALS,
      statusCode: StatusCodes.INVALID_CREDENTIALS
    });
  }

  serialize(): IErrorResponse['error'] {
    return {
      code: this.errorCode,
      message: this.message,
    };
  }
}
