import assert from "assert";
import { config } from "dotenv";
import { describe } from "node:test";
import { dbSetup, prisma } from "../src/client/client";
import { serverSetup } from "../src/server-setup";

let fastify;

before(async () => {
  config()
  console.log('Ambiente atual:', process.env);
  dbSetup();
  fastify = await serverSetup()
})

describe('GET Users', function () {
  it('should return -1 when the value is not present', function () {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});

after(async () => {
  await fastify.close();
  console.info("Server closed")
  await prisma.$disconnect()
})
