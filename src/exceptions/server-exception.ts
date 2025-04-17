import { ExceptionResponse } from "./exception.types";

const statusCode = 500;
const standardMessage = "Houve um erro na conexão com o servidor."
const standardCode = "SERVER_ERROR";

export function internalServerException({ message = standardMessage, code = standardCode, details }: ExceptionResponse): never {
  throw ({ statusCode, message, code, details });
}
