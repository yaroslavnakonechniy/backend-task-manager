import { BaseError } from "./base";
import { ErrorCodes, IErrorResponse, StatusCodes } from "../../interfaces";

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCodes.FORBIDDEN,
      statusCode: StatusCodes.FORBIDDEN
    });
  }

  serialize(): IErrorResponse['error'] {
    return {
      code: this.errorCode,
      message: this.message,
    };
  }
}
