import { CustomException } from "./custom-exception";
import { ExceptionResponse } from "./exception.types";

export class NotAuthenticateException extends CustomException {
  static readonly STATUS_CODE = 401;
  static readonly DEFAULT_MESSAGE = "O cabeçalho de autorização está ausente ou é inválido";
  static readonly DEFAULT_CODE = "INVALID_AUTHENTICATION";

  constructor(
    {
      message = NotAuthenticateException.DEFAULT_MESSAGE,
      code = NotAuthenticateException.DEFAULT_CODE,
      details
    }: ExceptionResponse
  ) {
    super({ statusCode: NotAuthenticateException.STATUS_CODE, message, code, details });
  }
}
