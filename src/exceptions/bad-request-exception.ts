import { CustomException } from "./custom-exception";
import { ExceptionResponse } from "./exception.types";

export class BadRequestEsception extends CustomException {
  static readonly STATUS_CODE = 400;
  static readonly DEFAULT_MESSAGE = "Um ou mais parâmetros da requisição estão inválidos.";
  static readonly DEFAULT_CODE = "INVALID_PARAMETER";

  constructor(
    {
      message = BadRequestEsception.DEFAULT_MESSAGE,
      code = BadRequestEsception.DEFAULT_CODE,
      details
    }: ExceptionResponse
  ) {
    super({ statusCode: BadRequestEsception.STATUS_CODE, message, code, details });
  }
}
