import axios from "axios";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import { prisma } from "../src/client/client";
import { UserRequest } from "../src/models/user-request.types";
import { UserResponse } from "../src/models/user-response.types";

const port = process.env.PORT ? +process.env.PORT : 30002;
const JWT_SECRET = process.env.JWT_SECRET!;

describe('POST Users - Create User', async () => {
  it('should create new user', async () => {
    const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

    const mockUser: UserRequest = {
      name: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: "2000-01-01",
    }

    const response = await axios.post<UserResponse>(`http://localhost:${port}/users`, mockUser, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status).to.equal(201);

    const expectedResponse = {
      id: response.data.id,
      name: "testuser",
      email: "testuser@example.com",
      birthDate: "2000-01-01T00:00:00.000Z",
    };

    expect(response.data).to.be.deep.eq(expectedResponse);

    const userInDb = await prisma.user.findUnique({
      where: { id: response.data.id },
    });

    expect(userInDb).to.not.be.null;

    const userFromDb = {
      id: userInDb?.id,
      name: userInDb?.name,
      email: userInDb?.email,
      birthDate: userInDb?.birthDate.toISOString(),
    }

    expect(response.data).to.be.deep.eq(userFromDb);
  });

  it("Should return an error if the Authorization header is missing", async () => {
    const mockUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: "2000-01-01",
    };

    const response = await axios.post(`http://localhost:${port}/users`, mockUser, { validateStatus: () => true });

    expect(response.status).to.equal(401);

    expect(response.data.message).to.equal(
      "Erro de autorização"
    );
  })

  it("Should return an error if the token is invalid", async () => {
    const mockUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: "2000-01-01",
    };

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

    expect(response.status).to.equal(401);

    expect(response.data.message).to.equal(
      "O Token não é válido ou está expirado"
    );
  });

  it("Should return an error if the token is expired", async () => {
    const expiredToken = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "-1s" });

    const mockUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: "2000-01-01",
    };

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

    expect(response.status).to.equal(401);
    expect(response.data.message).to.equal(
      "O Token não é válido ou está expirado"
    );
  });
})

it('should throw password validation', async () => {
  const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

  const mockUser: UserRequest = {
    name: "testuser",
    email: "mockuser@example.com",
    password: "password",
    birthDate: "2000-01-01",
  }

  const response = await axios.post(`http://localhost:${port}/users`, mockUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true
  });

  expect(response.status).to.equal(400);
  expect(response.data).to.deep.equal({
    message: "A senha deve ter pelo menos 6 caracteres e conter pelo menos 1 letra e 1 dígito",
    code: "WEAK_PASSWORD",
  });
});

it('should throw email validation', async () => {
  const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

  const mockUser: UserRequest = {
    name: "testuser",
    email: "testuser@example.com",
    password: "Password123",
    birthDate: "2000-01-01",
  }

  await prisma.user.create({ data: { ...mockUser, birthDate: new Date(mockUser.birthDate) } })

  const response = await axios.post(`http://localhost:${port}/users`, mockUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true
  });
  expect(response.status).to.equal(409);
  expect(response.data).to.deep.equal({
    message: "Falha ao criar o usuário: email já existe",
    code: "DUPLICATE_EMAIL",
    details: "Email already exists in the database and must be unique"
  });

});
