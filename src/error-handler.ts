import { FastifyError, FastifyReply } from "fastify";
import { CustomError, ErrorResponse } from "./exceptions/exception.types";

export function configureErrorHandler(error: FastifyError | CustomError, reply: FastifyReply) {
  if ('validation' in error) {
    const response: ErrorResponse = {
      message: "Erro no envio da mensagem devido ao mau formato da requisição",
      code: "INVALID_PARAMETER",
      details: error.validation?.map(validation => validation.message).filter(validation => validation !== undefined)
    };

    reply.status(400).send(response);
  } else {
    const statusCode = error.statusCode ? error.statusCode : 500;

    const response: ErrorResponse = {
      message: error.message || 'Erro interno do servidor',
      code: error.code ? error.code : 'UNEXPECTED_ERROR',
      details: 'details' in error ? error.details : undefined
    };

    reply.status(statusCode).send(response);
  }
}
