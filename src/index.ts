import Fastify, { FastifyInstance } from "fastify";

const fastify: FastifyInstance = Fastify({ logger: true });

const PORT = 30001;

fastify.get("/hello", async (): Promise<string> => {
  return "Hello, World!!";
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
