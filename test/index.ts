import { config } from "dotenv";
import { FastifyInstance } from "fastify";
import { dbSetup, prisma } from "../src/client/client";
import { serverSetup } from "../src/server-setup";

let fastify: FastifyInstance;
let port: number;

before(async () => {
  config({ path: "/home/taqtile/Desktop/onboard-giovani-ferro/test.env" })
  dbSetup();
  fastify = await serverSetup()
})

import "./users-get-test";
import "./users-post-test";

after(async () => {
  await prisma.user.deleteMany();
  await fastify.close();
  await prisma.$disconnect()
  console.info("Server closed")
})
