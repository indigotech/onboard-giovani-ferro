import { CustomError } from "./exception.types";

export class CustomException extends Error {
  statusCode: number;
  code: string;
  details?: string | string[];

  constructor({ statusCode, message, code, details }: CustomError) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
