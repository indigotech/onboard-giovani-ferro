import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed() {
  await prisma.user.createMany({ data: users, skipDuplicates: true });
}

function createTestUsers(count: number) {
  const users: any = []
  for (let i = 0; i < count; i++) {
    users.push({
      name: `user${String.fromCharCode(65 + i)}`,
      email: `user${i}@example.com`,
      password: `user${i}Password123`,
      birthDate: new Date("2000-01-01"),
    });
  }
  return users
}

const users = createTestUsers(50);

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
