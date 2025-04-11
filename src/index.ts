import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Fastify, { FastifyInstance } from "fastify";
import { createUserHandler } from "./domain/command/create-user";
import { findUsers } from "./domain/query/find-users";
import { UserRequest } from "./models/user-request.types";
import { isStrongPassword } from "./shared/helper/user-validation";

const fastify: FastifyInstance = Fastify({ logger: true });

const PORT = 30001;

fastify.get("/users", async (_, reply) => {
  try {
    const userResponse = await findUsers();

    reply.status(200).send(userResponse);

  } catch (error: unknown) {
    reply.send({ error: "Failed to fetch users" });
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
      return reply.status(400).send({
        error: 'Password must be at least 6 characters long and contain at least 1 letter and 1 digit',
      });
    }

    const userResponse = await createUserHandler(request.body as UserRequest)

    reply.status(201).send(userResponse);
  } catch (error: unknown) {
    const { code } = error as PrismaClientKnownRequestError

    if (code === 'P2002') {
      reply.status(409).send({ error: `Failed to create user: Unique constraint failed` });
    }

    reply.status(500).send({ error: `Failed to create user` });
  }
});

async function start(): Promise<void> {
  try {
    await fastify.listen({ port: PORT });
    fastify.log.info(`Server listening on ${PORT}`);
  } catch (err: unknown) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
