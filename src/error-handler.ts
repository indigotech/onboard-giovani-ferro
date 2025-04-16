import { FastifyError, FastifyReply } from "fastify";
import { CustomException } from "./exceptions/custom-exception";
import { ErrorResponse } from "./exceptions/exception.types";

export function configureErrorHandler(error: FastifyError | CustomException, reply: FastifyReply) {
  if (error instanceof CustomException) {
    const statusCode = error.statusCode ?? 500;

    const response: ErrorResponse = {
      message: error.message ?? 'Erro interno do servidor',
      code: error.code ? error.code : 'UNEXPECTED_ERROR',
      details: error.details
    };

    reply.status(statusCode).send(response);
  } else {
    const response: ErrorResponse = {
      message: "Erro no envio da mensagem devido ao mau formato da requisição",
      code: "INVALID_PARAMETER",
      details: error.validation?.map(validation => validation.message).filter(validation => validation !== undefined)
    };

    reply.status(400).send(response);
  }
}

export function errorHandlerSetup(error: FastifyError, reply: FastifyReply) {
  if (error.validation) {
    createError({
      reply,
      statusCode: 400,
      message: "Erro no envio da mensagem devido ao mau formato da requisição",
      code: "ERRO_REQUISICAO",
      details: error.validation.at(0)?.message
    }
    )
  } else {
    createError(
      {
        reply,
        statusCode: error.statusCode,
        message: error.message,
        code: "ERRO_INESPERADO"
      }
    );
  }
}
