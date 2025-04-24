import { CustomException } from "./custom-exception";
import { ExceptionResponse } from "./exception.types";

export class ConflictException extends CustomException {
  static readonly STATUS_CODE = 409;
  static readonly DEFAULT_MESSAGE = "Não foi possível realizar a requisição devido a um conflito de parâmetros";
  static readonly DEFAULT_CODE = "DUPLICATED_PARAMETER";

  constructor(
    {
      message = ConflictException.DEFAULT_MESSAGE,
      code = ConflictException.DEFAULT_CODE,
      details
    }: ExceptionResponse
  ) {
    super({ statusCode: ConflictException.STATUS_CODE, message, code, details });
  }
}
