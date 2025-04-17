import { ExceptionResponse } from "./exception.types";

const statusCode = 401;
const standardMessage = "O cabeçalho de autorização está ausente ou é inválido"
const standardCode = "INVALID_AUTHENTICATION";

export function notAuthenticateException({ message = standardMessage, code = standardCode, details }: ExceptionResponse): never {
  throw ({ statusCode, message, code, details });
}
