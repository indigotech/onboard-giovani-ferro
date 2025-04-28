import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { GraphQLError } from "graphql";
import { CustomException } from "./exceptions/custom-exception";
import { ErrorResponse } from "./exceptions/exception.types";

const DEFAULT_MESSAGE = "Informações enviadas estão incompletas ou incorretas. Por favor, verifique os dados e tente novamente.";
const DEFAULT_CODE = "INVALID_PARAMETER";

export function configureErrorHandler(error: FastifyError | CustomException, request: FastifyRequest, reply: FastifyReply) {
  if (request.url.startsWith('/graphql')) {
    return configureGraphqlErrorHandler(error)
  }

  if (error instanceof CustomException) {
    const statusCode = error.statusCode ?? 500;

    const response: ErrorResponse = {
      message: error.message ?? 'Erro interno do servidor',
      code: error.code ?? 'UNEXPECTED_ERROR',
      details: error.details
    };

    reply.status(statusCode).send(response);
  } else {
    const response: ErrorResponse = {
      message: DEFAULT_MESSAGE,
      code: DEFAULT_CODE,
      details: error.validation?.map(validation => validation.message).filter(validation => validation !== undefined)
    };

    reply.status(400).send(response);
  }
}

export function configureGraphqlErrorHandler(error: FastifyError | CustomException) {
  if (error instanceof CustomException) {
    return new GraphQLError(
      error.message ?? 'Erro interno do servidor',
      {
        extensions: {
          code: error.code ?? 'UNEXPECTED_ERROR',
          details: error.details
        }
      }
    );
  }
  else {
    return new GraphQLError(
      DEFAULT_MESSAGE,
      {
        extensions: {
          code: DEFAULT_CODE,
          details: error.validation?.map(validation => validation.message).filter(validation => validation !== undefined)
        }
      }
    );
  }
}
