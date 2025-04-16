import { FastifyReply } from "fastify";

interface CustomError {
  reply: FastifyReply, statusCode: number, message: string, code: string, details?: string
}

export function createError({ reply, statusCode, message, code, details }: CustomError) {
  return reply.status(statusCode).send({ message, code, details });
}
