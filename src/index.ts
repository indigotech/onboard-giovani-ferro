import Fastify, { FastifyInstance } from "fastify";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserRequest } from "./models/user-request.types";
import { UserResponse } from "./models/user-response.types";
import { createUser, getUsers } from "./repository/db-repository";
import { isStrongPassword } from "./shared/user-validation";


const fastify: FastifyInstance = Fastify({ logger: true });

const PORT = 30001;

fastify.get("/users", async (_, reply) => {
  try {
    const users = await getUsers()

    const userResponse: UserResponse[] = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    }))

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

    const user = await createUser(body);

    if (!user) {
      return reply.status(400).send({ error: "User not created" });
    }

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    };

    reply.status(201).send(userResponse);
  } catch (error: unknown) {
    const { code, meta } = error as PrismaClientKnownRequestError

    if (code === 'P2002') {
      reply.status(500).send({ error: `Failed to create user: Unique constraint failed` });
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
