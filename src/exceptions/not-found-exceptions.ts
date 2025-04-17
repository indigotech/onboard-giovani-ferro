import { CustomException } from "./custom-exception";
import { ExceptionResponse } from "./exception.types";

export class UserNotFoundException extends CustomException {
  static readonly STATUS_CODE = 404;
  static readonly DEFAULT_MESSAGE = "O usuário não foi encontrado no sistema";
  static readonly DEFAULT_CODE = "USER_NOT_FOUND";

  constructor(
    {
      message = UserNotFoundException.DEFAULT_MESSAGE,
      code = UserNotFoundException.DEFAULT_CODE,
      details
    }: ExceptionResponse
  ) {
    super({ statusCode: UserNotFoundException.STATUS_CODE, message, code, details });
  }
}
