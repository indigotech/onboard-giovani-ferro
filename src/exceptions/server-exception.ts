import { CustomException } from "./custom-exception";
import { ExceptionResponse } from "./exception.types";


export class InternalServerException extends CustomException {
  static readonly STATUS_CODE = 500;
  static readonly DEFAULT_MESSAGE = "Houve um erro na conexão com o servidor.";
  static readonly DEFAULT_CODE = "SERVER_ERROR";

  constructor(
    {
      message = InternalServerException.DEFAULT_MESSAGE,
      code = InternalServerException.DEFAULT_CODE,
      details
    }: ExceptionResponse
  ) {
    super({ statusCode: InternalServerException.STATUS_CODE, message, code, details });
  }
}
