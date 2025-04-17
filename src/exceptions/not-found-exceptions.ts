import { ExceptionResponse } from "./exception.types";

const statusCode = 404;
const standardMessage = "O usuário não foi encontrado no sistema"
const standardCode = "USER_NOT_FOUND";

export function userNotFoundException({ message = standardMessage, code = standardCode, details }: ExceptionResponse): never {
  throw ({ statusCode, message, code, details });
}
