import axios from "axios";
import { expect } from "chai";
import { prisma } from "../src/client/client";
import { UserRequest } from "../src/models/user-request.types";
import { UserResponse } from "../src/models/user-response.types";

const port = process.env.PORT ? +process.env.PORT : 30002;

describe('POST Users - Create User', async () => {
  it('should create new user', async () => {
    const mockUser: UserRequest = {
      name: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: "2000-01-01",
    }

    const response = await axios.post<UserResponse>(`http://localhost:${port}/users`, mockUser);

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

  it('should throw password validation', async () => {
    const mockUser: UserRequest = {
      name: "testuser",
      email: "mockuser@example.com",
      password: "password",
      birthDate: "2000-01-01",
    }
    const response = await axios.post(`http://localhost:${port}/users`, mockUser, { validateStatus: () => true });

    expect(response.status).to.equal(400);
    expect(response.data).to.have.property("message");
    expect(response.data).to.have.property("code");
    expect(response.data).to.deep.equal({
      message: "A senha deve ter pelo menos 6 caracteres e conter pelo menos 1 letra e 1 dígito",
      code: "WEAK_PASSWORD",
    });
  });

  it('should throw email validation', async () => {
    const mockUser: UserRequest = {
      name: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: "2000-01-01",
    }

    await prisma.user.create({ data: { ...mockUser, birthDate: new Date(mockUser.birthDate) } })

    const response = await axios.post(`http://localhost:${port}/users`, mockUser, { validateStatus: () => true });
    expect(response.status).to.equal(409);
    expect(response.data).to.have.property("message");
    expect(response.data).to.have.property("code");
    expect(response.data).to.have.property("details");
    expect(response.data).to.deep.equal({
      message: "Falha ao criar o usuário: email já existe",
      code: "DUPLICATE_EMAIL",
      details: "Email already exists in the database and must be unique"
    });

  });
});
