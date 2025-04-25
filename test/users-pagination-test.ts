import axios from "axios";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import { prisma } from "../src/client/client";

const port = process.env.PORT ? +process.env.PORT : 30002;
const JWT_SECRET = process.env.JWT_SECRET!;

describe('GET /users', async () => {
  const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

  it("Should return paginated response with correct structure and default values", async () => {
    await addUsersToDB(20);
    const users = await getUsersPaginated({ skip: 0, take: 15 });

    const response = await axios.get(`http://localhost:${port}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.deep.equals({
      users: users,
      pagination: {
        total: 20,
        hasNext: true,
        hasPrevious: false,
      }
    });
  });

  it("Should return correct pagination info for middle page", async () => {
    await addUsersToDB(25);
    const page = 2;
    const pageSize = 10;
    const skip = (page - 1) * pageSize

    const users = await getUsersPaginated({ skip, take: pageSize })

    const response = await axios.get(`http://localhost:${port}/users?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.data).to.be.deep.equals({
      users: users,
      pagination: {
        total: 25,
        hasNext: true,
        hasPrevious: true,
      }
    });
  });

  it("Should return correct pagination info for last page", async () => {
    await addUsersToDB(25);
    const page = 3;
    const pageSize = 10;
    const skip = (page - 1) * pageSize

    const users = await getUsersPaginated({ skip, take: pageSize })

    const response = await axios.get(`http://localhost:${port}/users?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.data).to.be.deep.equals({
      users,
      pagination: {
        total: 25,
        hasNext: false,
        hasPrevious: true,
      }
    });
  });

  it("Should return an error if the Authorization header is missing", async () => {
    const response = await axios.get(`http://localhost:${port}/users`, {
      validateStatus: () => true
    });
    expect(response.status).to.be.equal(401);
    expect(response.data).to.be.deep.equal({
      message: "O cabeçalho de autorização está ausente ou é inválido",
      code: "INVALID_AUTHENTICATION",
      details: "The token does not exists or has invalid format.",
    });
  });

  it("Should return an error if the token is invalid", async () => {
    const invalidToken = "invalid.token.here";

    const response = await axios.get(`http://localhost:${port}/users/9999`, {
      headers: {
        Authorization: `Bearer ${invalidToken}`,
      },
      validateStatus: () => true
    });
    expect(response.status).to.be.equal(401);
    expect(response.data).to.be.deep.equal({
      code: "INVALID_AUTHENTICATION",
      message: "O Token não é válido ou está expirado",
    });
  });
});

interface PaginationTestRequest {
  take: number;
  skip: number;
}

async function addUsersToDB(count: number) {
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

async function getUsersPaginated({ take, skip }: PaginationTestRequest) {
  const users = await prisma.user.findMany({
    select: {
      birthDate: true,
      email: true,
      id: true,
      name: true,
      addresses: true
    },
    orderBy: { name: "asc" },
    skip,
    take
  });

  return users.map(user => {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      birthDate: user.birthDate.toISOString(),
      addresses: user.addresses
    }
  })
}
