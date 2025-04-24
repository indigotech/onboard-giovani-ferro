import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({ data: users, skipDuplicates: true });
}

function createUserMock() {
  return {
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    birthDate: faker.date.birthdate(),
  }
}

const users = faker.helpers.multiple(createUserMock, {
  count: 50,
});

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
