import axios from "axios";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import { prisma } from "../src/client/client";
import { UserRequest } from "../src/models/user-request.types";
import { UserResponse } from "../src/models/user-response.types";

const port = process.env.PORT ? +process.env.PORT : 30002;
const JWT_SECRET = process.env.JWT_SECRET!;

describe('POST /users - Create User', async () => {
  const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });
  const mockAddresses = [
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

  const mockUser: UserRequest = {
    name: "testuser",
    email: "mockuser@example.com",
    password: "password123",
    birthDate: "2000-01-01",
    addresses: []
  }

  it('Should create new user', async () => {
    const response = await axios.post<UserResponse>(`http://localhost:${port}/users`, { ...mockUser, addresses: mockAddresses }, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: () => true
    });

    expect(response.status).to.be.equal(201);

    const expectedResponse = {
      id: response.data.id,
      name: "testuser",
      email: "mockuser@example.com",
      birthDate: "2000-01-01T00:00:00.000Z",
      addresses: [{
        id: response.data.addresses[0].id,
        userId: response.data.addresses[0].userId,
        cep: "12345-678",
        street: "Test Street",
        streetNumber: "123",
        neighborhood: "Test Neighborhood",
        city: "Test City",
        state: "SP",
        complement: null
      }]
    };

    expect(response.data).to.be.deep.eq(expectedResponse);

    const userInDb = await prisma.user.findUnique({
      where: { id: response.data.id },
      include: { addresses: true }
    });

    expect(userInDb).to.not.be.null;

    const userFromDb = {
      id: userInDb?.id,
      name: userInDb?.name,
      email: userInDb?.email,
      birthDate: userInDb?.birthDate.toISOString(),
      addresses: userInDb?.addresses
    }

    expect(response.data).to.be.deep.eq(userFromDb);
  });

  it("Should return an error if the Authorization header is missing", async () => {
    const response = await axios.post(`http://localhost:${port}/users`, mockUser, { validateStatus: () => true });

    expect(response.status).to.be.equal(401);

    expect(response.data).to.be.deep.equal({
      message: "O cabeçalho de autorização está ausente ou é inválido",
      code: "INVALID_AUTHENTICATION",
      details: "The token does not exists or has invalid format.",
    });
  })

  it("Should return an error if the token is invalid", async () => {
    const invalidToken = "invalid.token.here";

    const response = await axios.post(
      `http://localhost:${port}/users`,
      mockUser,
      {
        headers: {
          Authorization: `Bearer ${invalidToken}`,
        },
        validateStatus: () => true
      }
    );

    expect(response.status).to.be.equal(401);

    expect(response.data).to.be.deep.equal({
      message: "O Token não é válido ou está expirado",
      code: "INVALID_AUTHENTICATION",
    });
  });

  it("Should return an error if the token is expired", async () => {
    const expiredToken = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "-1s" });

    const response = await axios.post(
      `http://localhost:${port}/users`,
      mockUser,
      {
        headers: {
          Authorization: `Bearer ${expiredToken}`,
        },
        validateStatus: () => true
      }
    );

    expect(response.status).to.be.equal(401);
    expect(response.data).to.have.property("message");
    expect(response.data).to.have.property("code");
    expect(response.data).to.be.deep.equal({
      message: "O Token não é válido ou está expirado",
      code: "INVALID_AUTHENTICATION"
    });
  });

  it('Should throw password validation', async () => {
    const response = await axios.post(`http://localhost:${port}/users`, { ...mockUser, password: "123456" }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true
    });

    expect(response.status).to.be.equal(400);
    expect(response.data).to.be.deep.equal({
      message: "A senha deve ter pelo menos 6 caracteres e conter pelo menos 1 letra e 1 dígito",
      code: "WEAK_PASSWORD",
    });
  });

  it('Should throw email validation', async () => {
    await prisma.user.create({ data: { ...mockUser, birthDate: new Date(mockUser.birthDate), addresses: { create: mockAddresses } }, include: { addresses: true } })

    const response = await axios.post(`http://localhost:${port}/users`, mockUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true
    });
    expect(response.status).to.be.equal(409);
    expect(response.data).to.be.deep.equal({
      message: "Falha ao criar o usuário: email já existe",
      code: "DUPLICATED_PARAMETER",
      details: "Email already exists in the database and must be unique"
    });
  });
});
