import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { sendErrorResponse } from "./error-handler";

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthenticationMiddleware {
  static async authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        sendErrorResponse({ reply, statusCode: 401, message: "Erro de autorização", code: "AUTORIZACAO_INVALIDA", details: "O cabeçalho de autorização está ausente ou é inválido" });
        return;
      }

      const token = authHeader.split(" ")[1];

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          sendErrorResponse({ reply, statusCode: 401, message: "O Token não é válido ou está expirado", code: "AUTORIZACAO_INVALIDA", details: err.message });
        }
      });
    } catch (error) {
      sendErrorResponse({ reply, statusCode: 401, message: "Erro de autorização", code: "AUTORIZACAO_INVALIDA", details: "O Token não é válido" });
    }

  }
}
