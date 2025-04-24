import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { GraphQLError } from "graphql";
import { CustomException } from "./exceptions/custom-exception";
import { CustomError, ErrorResponse } from "./exceptions/exception.types";

export function configureErrorHandler(error: FastifyError | CustomException, request: FastifyRequest, reply: FastifyReply) {
  if (request.url.startsWith('/graphql')) {
    return configureGraphqlErrorHandler(error)
  }

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

export function configureGraphqlErrorHandler(error: FastifyError | CustomError) {
  console.log(error)
  if (error && typeof error === 'object' && 'validation' in error) {
    return new GraphQLError(
      "Erro no envio da mensagem devido ao mau formato da requisição",
      {
        extensions: {
          code: "INVALID_PARAMETER",
          details: error.validation?.at(0)?.message
        }
      }
    );
  }
  else {
    const customError = error as CustomError;
    return new GraphQLError(
      customError.message || 'Erro interno do servidor',
      {
        extensions: {
          code: customError.code || 'UNEXPECTED_ERROR',
          details: 'details' in customError ? customError.details : undefined
        }
      }
    );
  }
}
