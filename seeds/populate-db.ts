import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed() {
  createTestUsers(50)
}

async function createTestUsers(count: number) {
  let data;
  for (let i = 0; i < count; i++) {
    data = {
      name: `user${String.fromCharCode(65 + i)}`,
      email: `user${i}@example.com`,
      password: `user${i}Password123`,
      birthDate: new Date("2000-01-01"),
      addresses: {
        create: [{
          cep: "01001-000",
          street: "Praça da Sé",
          streetNumber: String(i + 1),
          neighborhood: "Sé",
          city: "São Paulo",
          state: "SP",
          complement: `Apto ${i + 1}`
        },
        {
          cep: "20031-170",
          street: "Avenida Rio Branco",
          streetNumber: String(i + 1),
          neighborhood: "Centro",
          city: "Rio de Janeiro",
          state: "RJ"
        }]
      }
    };
    await prisma.user.create({ data, include: { addresses: true } });
  }
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
