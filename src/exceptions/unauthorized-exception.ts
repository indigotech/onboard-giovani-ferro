import { ExceptionResponse } from "./exception.types";

const statusCode = 403;
const standardMessage = "O Token não é válido ou está expirado"
const standardCode = "INVALID_AUTHORIZATION";

export function unauthorizedException({ message = standardMessage, code = standardCode, details }: ExceptionResponse): never {
  throw ({ statusCode, message, code, details });
}
