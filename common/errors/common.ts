import { BaseError } from "./base";
import { ErrorCodes, IErrorResponse, StatusCodes } from "../../interfaces";

export class CommonError extends BaseError {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCodes.COMMON_ERROR,
      statusCode: StatusCodes.COMMON_ERROR
    });
  }

  serialize(): IErrorResponse['error'] {
    return {
      code: this.errorCode,
      message: this.message,
    };
  }
}
