import { BaseError } from "./base";
import { ErrorCodes, ErrorResponse, StatusCodes } from "../../interfaces";

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCodes.NOT_FOUND,
      statusCode: StatusCodes.NOT_FOUND
    });
  }

  serialize(): ErrorResponse {
    return {
      code: this.errorCode,
      message: this.message,
    };
  }
}
