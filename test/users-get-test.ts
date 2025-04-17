import axios from "axios";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import { prisma } from "../src/client/client";
import { UserRequest } from "../src/models/user-request.types";

const port = process.env.PORT ? +process.env.PORT : 30002;
const JWT_SECRET = process.env.JWT_SECRET!;

describe("GET /users/:id", () => {
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


  it("Should return user information for a valid id and token", async () => {
    const user = await prisma.user.create({ data: { ...mockUser, birthDate: new Date(mockUser.birthDate), addresses: { create: mockAddresses } }, include: { addresses: true } })

    const response = await axios.get(`http://localhost:${port}/users/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.deep.equal({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
      addresses: user.addresses
    });
  });

  it("Should return an error if the user is not found", async () => {
    const response = await axios.get(`http://localhost:${port}/users/9999`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true
    });
    expect(response.status).to.be.equal(404);
    expect(response.data).to.be.deep.equal({
      code: "USER_NOT_FOUND",
      message: "O usuário não foi encontrado no sistema",
    });
  }
  );

  it("Should return an error if the Authorization header is missing", async () => {
    const response = await axios.get(`http://localhost:${port}/users/9999`, {
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
    expect(response.status).to.be.equal(403);
    expect(response.data).to.be.deep.equal({
      code: "INVALID_AUTHENTICATION",
      message: "O Token não é válido ou está expirado",
    });
  });

  it("Should return an error for a non-numeric ID", async () => {
    const response = await axios.get(`http://localhost:${port}/users/9999`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true
    });
    expect(response.status).to.be.equal(404);
    expect(response.data).to.be.deep.equal({
      code: "USER_NOT_FOUND",
      message: "O usuário não foi encontrado no sistema",
    });
  });

  it("Should return an error for a negative ID", async () => {
    const response = await axios.get(`http://localhost:${port}/users/9999`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true
    });
    expect(response.status).to.be.equal(404);
    expect(response.data).to.be.deep.equal({
      code: "USER_NOT_FOUND",
      message: "O usuário não foi encontrado no sistema",
    });
  });
});

describe("GET /users/:id", () => {
  it("Should return user information for a valid id and token", async () => {
    const mockUser: UserRequest = {
      name: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: "2000-01-01",
    };

    const user = await prisma.user.create({ data: { ...mockUser, birthDate: new Date(mockUser.birthDate) } })

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    const response = await axios.get(`http://localhost:${port}/users/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.deep.equal({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
    });
  });

  it("Should return an error if the user is not found", async () => {
    const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

    const response = await axios.get(`http://localhost:${port}/users/9999`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true
    });
    expect(response.status).to.equal(404);
    expect(response.data).to.deep.equal({
      code: "USER_NOT_FOUND",
      message: "O usuário não foi encontrado no sistema",
    });
  }
  );

  it("Should return an error if the Authorization header is missing", async () => {
    const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

    const response = await axios.get(`http://localhost:${port}/users/9999`, {
      validateStatus: () => true
    });
    expect(response.status).to.equal(401);
    expect(response.data).to.deep.equal({
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
    expect(response.status).to.equal(403);
    expect(response.data).to.deep.equal({
      code: "INVALID_AUTHORIZATION",
      message: "O Token não é válido ou está expirado",
    });
  });

  it("Should return an error for a non-numeric ID", async () => {
    const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

    const response = await axios.get(`http://localhost:${port}/users/9999`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true
    });
    expect(response.status).to.equal(404);
    expect(response.data).to.deep.equal({
      code: "USER_NOT_FOUND",
      message: "O usuário não foi encontrado no sistema",
    });
  });

  it("Should return an error for a negative ID", async () => {
    const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

    const response = await axios.get(`http://localhost:${port}/users/9999`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true
    });
    expect(response.status).to.equal(404);
    expect(response.data).to.deep.equal({
      code: "USER_NOT_FOUND",
      message: "O usuário não foi encontrado no sistema",
    });
  });
});
