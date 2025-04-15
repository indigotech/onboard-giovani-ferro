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
});

describe('POST Users - Weak Password', async () => {
  it('should throw password validation', async () => {
    const mockUser: UserRequest = {
      name: "testuser",
      email: "mockuser@example.com",
      password: "password",
      birthDate: "2000-01-01",
    }
    const response = await axios.post(`http://localhost:${port}/users`, mockUser, { validateStatus: () => true });

    expect(response.status).to.equal(400);
    expect(response.data).to.have.property("error");
    expect(response.data.error).to.equal(
      "Password must be at least 6 characters long and contain at least 1 letter and 1 digit"
    );
  });
});

describe('POST Users - Duplicated Email', async () => {
  it('should throw email validation', async () => {
    const mockUser: UserRequest = {
      name: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: "2000-01-01",
    }

    prisma.user.create({ data: mockUser })

    const response = await axios.post(`http://localhost:${port}/users`, mockUser, { validateStatus: () => true });
    expect(response.status).to.equal(409);
    expect(response.data).to.have.property("error");
    expect(response.data.error).to.equal(
      "Failed to create user: Unique constraint failed"
    );

  });
});
