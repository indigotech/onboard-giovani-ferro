import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Fastify, { FastifyInstance } from "fastify";
import { createUserHandler } from "./domain/create-user";
import { findUsersHandler } from "./domain/find-users";
import { createError } from "./error-handler";
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

    createError({ reply, statusCode: 500, message, code: codeMessage })
  }
});

fastify.post<{ Body: UserRequest }>("/users", {
  schema: {
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        birthDate: { type: 'string', format: 'date' }
      }
    }
  }
}, async (request, reply) => {
  try {
    const { body } = request;

    if (!isStrongPassword(body.password)) {
      const message = "A senha deve ter pelo menos 6 caracteres e conter pelo menos 1 letra e 1 dígito"
      const code = "WEAK_PASSWORD"
      return createError({ reply, statusCode: 400, message, code });
    }

    const userResponse = await createUserHandler(body)

    reply.status(201).send(userResponse);
  } catch (error: unknown) {
    const { code } = error as PrismaClientKnownRequestError

    if (code === 'P2002') {
      const message = "Falha ao criar o usuário: email já existe";
      const codeMessage = "DUPLICATE_EMAIL";
      const details = "Email already exists in the database and must be unique";
      return createError({ reply, statusCode: 409, message, code: codeMessage, details });
    }

    const message = "Falha ao buscar o usuário. Tente novamente.";
    const codeMessage = "UNEXPECTED_ERROR";

    createError({ reply, statusCode: 500, message, code: codeMessage })
  }
});

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
