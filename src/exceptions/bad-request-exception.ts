import { ExceptionResponse } from "./exception.types";

const statusCode = 400;
const standardMessage = "Um ou mais parâmetros da requisição estão inválidos."
const standardCode = "INVALID_PARAMETER";

export function invalidParameterException({ message = standardMessage, code = standardCode, details }: ExceptionResponse): never {
  throw ({ statusCode, message, code, details });
}
