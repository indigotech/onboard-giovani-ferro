import { throwError } from "../error-handler";
import { ExceptionResponse } from "./exception.types";

const statusCode = 400;
const standardMessage = "Um ou mais parâmetros da requisição estão inválidos."
const standardCode = "INVALID_PARAMETER";

export function invalidParameter({ message = standardMessage, code = standardCode, details }: ExceptionResponse) {
  throwError({ statusCode, message, code, details });
}
