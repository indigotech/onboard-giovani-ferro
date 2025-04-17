import Fastify, { FastifyInstance } from "fastify";
import { authenticationHandler } from "./domain/authenticate";
import { createUserHandler } from "./domain/create-user";
import { findUserByIdHandler, findUsersHandler } from "./domain/find-users";
import { configureErrorHandler } from "./error-handler";
import { AuthRequest } from "./models/auth-request.types";
import { UserRequest } from "./models/user-request.types";
import { authenticationOptions, createUserOptions, getUserByIdOptions } from "./schema";

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.get("/users", async (_, reply) => {

  const userResponse = await findUsersHandler();

  reply.status(200).send(userResponse);
});

fastify.post<{ Body: UserRequest }>("/users", createUserOptions, async (request, reply) => {
  const { body } = request;
  reply.status(200).send(userResponse);
});

fastify.get<{ Params: { id: number } }>("/users/:id", getUserByIdOptions, async (request, reply) => {
  const userResponse = await findUserByIdHandler(request.params.id);

  reply.status(200).send(userResponse);
});

fastify.post<{ Body: UserRequest }>("/users", createUserOptions, async (request, reply) => {
  const { body } = request;

  const userResponse = await createUserHandler(body)

  reply.status(201).send(userResponse);
});

fastify.post<{ Body: AuthRequest }>("/auth", authenticationOptions, async (request, reply) => {
  const { body } = request;

  const userResponse = await authenticationHandler(body);

  reply.status(201).send(userResponse);
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
