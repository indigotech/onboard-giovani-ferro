import Fastify, { FastifyInstance } from "fastify";

import { createUser, getUsers } from "./repository/db-repository";
import { UserRequest } from "./models/request/user/user-request.types";
import { UserResponse } from "./models/response/user/user-response.types";


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

fastify.post("/users", async (request, reply) => {
  try {
    const user = await createUser(request.body as UserRequest);

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
    reply.status(500).send({ error: "Failed to create user" });
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
