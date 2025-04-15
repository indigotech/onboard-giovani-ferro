import { FastifyReply } from "fastify";

export function createError(reply: FastifyReply, statusCode: number = 400, message: string, code: string, details?: string) {
  return reply.status(statusCode).send({ message, code, details });
}
