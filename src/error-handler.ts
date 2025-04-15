import { FastifyError, FastifyReply } from "fastify";

interface CustomError {
  reply: FastifyReply, statusCode: number, message: string, code: string, details?: string
}

export function createError({ reply, statusCode, message, code, details }: CustomError) {
  return reply.status(statusCode).send({ message, code, details });
}

export function errorHandlerSetup(error: FastifyError, reply: FastifyReply) {
  if (error.validation) {
    createError(
      {
        reply,
        statusCode: 400,
        message: "Erro no envio da mensagem devido ao mau formato da requisição",
        code: "REQUEST_ERROR",
        details: error.validation.at(0)?.message
      }
    )
  } else {
    createError(
      {
        reply,
        statusCode: error.statusCode ?? 500,
        message: error.message,
        code: "UNEXPECTED_ERROR"
      }
    );
  }
}
