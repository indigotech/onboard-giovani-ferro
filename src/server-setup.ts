import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Fastify, { FastifyInstance } from "fastify";
import { AuthenticationMiddleware } from "./authenticate-middleware";
import { authenticationHandler } from "./domain/authenticate";
import { createUserHandler } from "./domain/create-user";
import { findUserByIdHandler, findUsersHandler } from "./domain/find-users";
import { configureErrorHandler, sendErrorResponse } from "./error-handler";
import { AuthRequest } from "./models/auth-request.types";
import { UserRequest } from "./models/user-request.types";
import { isStrongPassword } from "./shared/user-validation";

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.get("/users", async (_, reply) => {
  try {
    const userResponse = await findUsersHandler();

    reply.status(200).send(userResponse);

  } catch (error: unknown) {
    const message = "Falha ao buscar o usuário. Tente novamente.";
    const codeMessage = "UNEXPECTED_ERROR";

    sendErrorResponse({ reply, statusCode: 500, message, code: codeMessage })
  }
});

fastify.get<{ Params: { id: number } }>("/users/:id", { preHandler: [AuthenticationMiddleware.authenticate] }, async (request, reply) => {
  try {
    console.log(request.params.id, typeof request.params.id)
    const userResponse = await findUserByIdHandler(request.params.id);

    reply.status(200).send(userResponse);

  } catch (error: unknown) {
    const message = "Usuário não encontrado";
    const codeMessage = "ERRO";
    const details = ["Tente novamente."];

    sendErrorResponse({ reply, statusCode: 400, message, code: codeMessage, details })
  }
});

fastify.post<{ Body: UserRequest }>("/users", {
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        birthDate: { type: 'string', format: 'date' }
      }
    }
  },
  preHandler: [AuthenticationMiddleware.authenticate]
}, async (request, reply) => {
  try {
    const { body } = request;

    if (!isStrongPassword(body.password)) {
      const message = "A senha deve ter pelo menos 6 caracteres e conter pelo menos 1 letra e 1 dígito"
      const code = "WEAK_PASSWORD"
      return sendErrorResponse({ reply, statusCode: 400, message, code });
    }

    const userResponse = await createUserHandler(body)

    reply.status(201).send(userResponse);
  } catch (error: unknown) {
    const { code } = error as PrismaClientKnownRequestError

    if (code === 'P2002') {
      const message = "Falha ao criar o usuário: email já existe";
      const codeMessage = "DUPLICATE_EMAIL";
      const details = "Email already exists in the database and must be unique";
      return sendErrorResponse({ reply, statusCode: 409, message, code: codeMessage, details });
    }

    const message = "Falha ao buscar o usuário. Tente novamente.";
    const codeMessage = "UNEXPECTED_ERROR";

    sendErrorResponse({ reply, statusCode: 500, message, code: codeMessage })
  }
});

fastify.post<{ Body: AuthRequest }>("/auth", {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        rememberMe: { type: 'boolean' },
      }
    }
  }
}, async (request, reply) => {
  try {
    const { body } = request;

    const userResponse = await authenticationHandler(body);

    reply.status(201).send(userResponse);
  } catch (error: unknown) {
    const message = "Credenciais Inválidas";
    const codeMessage = "INVALID_AUTHENTICATION";
    const details = "Email e/ou Senha do usuário está incorreto";

    sendErrorResponse({ reply, statusCode: 401, message, code: codeMessage, details })
  }
});

fastify.setErrorHandler((error, request, reply) => configureErrorHandler(error, reply));

export async function serverSetup(): Promise<FastifyInstance> {
  try {
    const port = process.env.PORT ? +process.env.PORT : 30001;
    await fastify.listen({ port });
    fastify.log.info(`Server listening on ${port}`);

    return fastify;
  } catch (err: unknown) {
    fastify.log.error(err);
    process.exit(1);
  }
};
