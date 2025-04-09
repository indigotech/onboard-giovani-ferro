import Fastify from "fastify";

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 30001;

fastify.get("/hello", async () => {
  return "Hello World!";
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
