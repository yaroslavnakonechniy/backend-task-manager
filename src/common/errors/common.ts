import { BaseError } from "./base";
import { ErrorCodes, ErrorResponse, StatusCodes } from "../../interfaces";

export class CommonError extends BaseError {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCodes.COMMON_ERROR,
      statusCode: StatusCodes.COMMON_ERROR
    });
  }

  serialize(): ErrorResponse {
    return {
      code: this.errorCode,
      message: this.message,
    };
  }
}
