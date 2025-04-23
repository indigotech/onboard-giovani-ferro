import { config } from "dotenv";
import { FastifyInstance } from "fastify";
import { dbSetup, prisma } from "../src/client/client";
import { serverSetup } from "../src/server-setup";

let fastify: FastifyInstance;

before(async () => {
  config()
  dbSetup();
  fastify = await serverSetup()
})

import "./authentication-test";
import "./graphql/users-post-test";
import "./users-get-test";
import "./users-pagination-test";
import "./users-post-test";

afterEach(async () => {
  await prisma.user.deleteMany();
})

after(async () => {
  await fastify.close();
  await prisma.$disconnect()
  console.info("Server closed")
})
