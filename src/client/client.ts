import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;

export function dbSetup() {
  const url = process.env.DATABASE_URL;

  console.log(url)
  prisma = new PrismaClient({ datasourceUrl: url })
}
