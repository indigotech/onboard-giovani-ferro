import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { createError } from "./error-handler";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      createError(reply, 401, "Erro de autorização", "AUTORIZACAO_INVALIDA", ["O cabeçalho de autorização está ausente ou é inválido"]);
      return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        createError(reply, 403, "O Token não é válido ou está expirado", "AUTORIZACAO_INVALIDA", [err.message]);
      }
    });
  } catch (error) {
    createError(reply, 403, "Erro de autorização", "AUTORIZACAO_INVALIDA", ["O Token não é válido"]);
  }
}
