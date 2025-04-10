import Fastify, { FastifyInstance } from "fastify";
import { UserEntity } from "./entities/user-entity.types";
import { getUsers } from "./repository/db-repository";

const fastify: FastifyInstance = Fastify({ logger: true });

const PORT = 30001;

fastify.get("/hello", async (): Promise<UserEntity[]> => {
  const users = await getUsers()
  return users;
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
