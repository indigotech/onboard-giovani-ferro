import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { notAuthenticateException } from "./exceptions/not-authenticate-exception";

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthenticationMiddleware {
  static async authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      notAuthenticateException({ details: "The token does not exists or has invalid format." });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        notAuthenticateException({ message: "O Token não é válido ou está expirado" });
      }
    });
  }
}

