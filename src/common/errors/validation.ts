import { ValidationError as DetailedError } from 'express-validator';
import { BaseError } from "./base";
import { ErrorCodes, ErrorResponse, StatusCodes } from "../../interfaces";

export class ValidationError extends BaseError {
  private readonly details: DetailedError[];

  constructor(message: string, details: DetailedError[] = []) {
    super({
      message,
      errorCode: ErrorCodes.VALIDATION_ERROR,
      statusCode: StatusCodes.VALIDATION_ERROR
    });

    this.details = details;
  }

  serialize(): ErrorResponse {
    const details = this.details
      .filter(err => err.type === 'field')
      .map(err => ({
        field: err.path,
        message: err.msg
      }));

    return {
      code: this.errorCode,
      message: this.message,
      details: details || [],
    };
  }
}
