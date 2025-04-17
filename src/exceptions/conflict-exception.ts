import { ExceptionResponse } from "./exception.types";

const statusCode = 409;
const standardMessage = "Não foi possível realizar a requisição devido a um conflito de parâmetros"
const standardCode = "DUPLICATED_PARAMETER";

export function conflictException({ message = standardMessage, code = standardCode, details }: ExceptionResponse): never {
  throw ({ statusCode, message, code, details });
}
