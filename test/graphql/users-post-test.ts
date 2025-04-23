import axios from "axios";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import { prisma } from "../../src/client/client";

const port = process.env.PORT ? +process.env.PORT : 30002;
const JWT_SECRET = process.env.JWT_SECRET!;

describe('GraphQL - Mutation createUser', () => {
  const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

  const mutation = `
    mutation CreateUser($data: CreateUserInput!) {
      createUser(data: $data) {
        id
        name
        email
        birthDate
        addresses {
          id
          cep
          street
          streetNumber
          neighborhood
          city
          state
          complement
        }
      }
    }
  `;

  const mockUser = {
    name: "testuser",
    email: "mockuser@example.com",
    password: "password123",
    birthDate: "2000-01-01",
    addresses: [
      {
        cep: "12345-678",
        street: "Test Street",
        streetNumber: "123",
        neighborhood: "Test Neighborhood",
        city: "Test City",
        state: "SP",
        complement: null
      }
    ]
  };

  it('Should create new user', async () => {
    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      {
        query: mutation,
        variables: { data: mockUser }
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true
      }
    );


    const expectedResponse = {
      id: response.data.data.createUser.id,
      name: "testuser",
      email: "mockuser@example.com",
      birthDate: new Date("2000-01-01").getTime().toString(),
      addresses: [{
        id: response.data.data.createUser.addresses[0].id,
        cep: "12345-678",
        street: "Test Street",
        streetNumber: "123",
        neighborhood: "Test Neighborhood",
        city: "Test City",
        state: "SP",
        complement: null
      }]
    };

    expect(response.data.data.createUser).to.be.deep.eq(expectedResponse);

    const userInDb = await prisma.user.findUnique({
      where: { id: response.data.data.createUser.id },
      include: { addresses: true }
    });

    expect(userInDb).to.not.be.null;

    const userFromDb = {
      id: userInDb?.id,
      name: userInDb?.name,
      email: userInDb?.email,
      birthDate: userInDb?.birthDate.getTime().toString(),
      addresses: userInDb?.addresses.map(addr => ({
        id: addr.id,
        cep: addr.cep,
        street: addr.street,
        streetNumber: addr.streetNumber,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        complement: addr.complement
      }))
    };

    expect(response.data.data.createUser).to.be.deep.eq(userFromDb);
  });

  it("Should return an error if the Authorization header is missing", async () => {
    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      { query: mutation, variables: { data: mockUser } },
      { validateStatus: () => true }
    );

    expect(response.data.errors[0]).to.be.deep.equal({
      message: "O cabeçalho de autorização está ausente ou é inválido",
      extensions: {
        code: "INVALID_AUTHENTICATION",
        details: "The token does not exists or has invalid format.",
      },
      locations: [
        {
          column: 7,
          line: 3
        }
      ],
      path: [
        "createUser"
      ]
    });
  });

  it("Should return an error if the token is invalid", async () => {
    const invalidToken = "invalid.token.here";
    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      { query: mutation, variables: { data: mockUser } },
      {
        headers: { Authorization: `Bearer ${invalidToken}` },
        validateStatus: () => true
      }
    );

    expect(response.data.errors[0]).to.be.deep.equal({
      message: "O Token não é válido ou está expirado",
      extensions: { code: "INVALID_AUTHORIZATION", },
      locations: [
        {
          column: 7,
          line: 3
        }
      ],
      path: [
        "createUser"
      ]
    });
  });

  it("Should return an error if the token is expired", async () => {
    const expiredToken = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "-1s" });
    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      { query: mutation, variables: { data: mockUser } },
      {
        headers: { Authorization: `Bearer ${expiredToken}` },
        validateStatus: () => true
      }
    );

    expect(response.data.errors[0]).to.deep.equal({
      message: "O Token não é válido ou está expirado",
      extensions: { code: "INVALID_AUTHORIZATION" },
      locations: [
        {
          column: 7,
          line: 3
        }
      ],
      path: [
        "createUser"
      ]
    });
  });

  it('Should throw password validation', async () => {
    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      {
        query: mutation,
        variables: { data: { ...mockUser, password: "123456" } }
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true
      }
    );

    expect(response.data.errors[0]).to.deep.equal({
      message: "A senha deve ter pelo menos 6 caracteres e conter pelo menos 1 letra e 1 dígito",
      extensions: { code: "WEAK_PASSWORD", },
      locations: [
        {
          column: 7,
          line: 3
        }
      ],
      path: [
        "createUser"
      ]
    });
  });

  it('Should throw email validation', async () => {
    await prisma.user.create({
      data: {
        ...mockUser,
        birthDate: new Date(mockUser.birthDate),
        addresses: { create: mockUser.addresses }
      }
    });

    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      { query: mutation, variables: { data: mockUser } },
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true
      }
    );

    expect(response.data.errors[0]).to.deep.equal({
      message: "Falha ao criar o usuário: email já existe",
      extensions: {
        code: "DUPLICATED_PARAMETER",
        details: "Email must be unique"
      },
      locations: [
        {
          column: 7,
          line: 3
        }
      ],
      path: [
        "createUser"
      ]
    });
  });
});
