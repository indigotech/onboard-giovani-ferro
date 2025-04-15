import axios from "axios";
import bcrypt from "bcrypt";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import { prisma } from "../src/client/client";

const port = process.env.PORT ? +process.env.PORT : 30002;
const JWT_SECRET = process.env.JWT_SECRET!;


describe("POST Authenticate - Authentication Sucessful", () => {
  it("Should return a valid token and user info on successful login", async () => {
    const mockUser = {
      name: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: new Date("2000-01-01"),
    };

    const hashedPassword = await bcrypt.hash(mockUser.password, 10);

    await prisma.user.create({
      data: { ...mockUser, password: hashedPassword },
    });

    const response = await axios.post(`http://localhost:${port}/auth`, {
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(response.status).to.equal(201);

    const { user, token } = response.data;

    expect(user).to.deep.equal({
      id: user.id,
      name: mockUser.name,
      email: mockUser.email,
      birthDate: mockUser.birthDate.toISOString(),
    });

    const decodedToken: any = jwt.verify(token, JWT_SECRET);

    expect(decodedToken).to.have.property("id", user.id);
    const now = Math.floor(Date.now() / 1000);
    expect(decodedToken.exp - now).to.be.closeTo(24 * 3600, 5);
  });
})

describe("POST Authenticate - Authentication Sucessful with Remember me", () => {
  it("Should return a valid token and expiration time of 1 day", async () => {
    const mockUser = {
      name: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: new Date("2000-01-01"),
    };

    const hashedPassword = await bcrypt.hash(mockUser.password, 10);
    await prisma.user.create({
      data: { ...mockUser, password: hashedPassword },
    });

    const response = await axios.post(`http://localhost:${port}/auth`, {
      email: mockUser.email,
      password: mockUser.password,
      rememberMe: true,
    });

    expect(response.status).to.equal(201);
    const { token } = response.data;

    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    const now = Math.floor(Date.now() / 1000);
    expect(decodedToken.exp - now).to.be.closeTo(7 * 24 * 3600, 5);
  });
})

describe("POST /login - Email Not Found", () => {
  it("Should return an error if the email is not found", async () => {
    const response = await axios.post(`http://localhost:${port}/auth`, {
      email: "nonexistent@example.com", password: "Password123"
    }, { validateStatus: () => true });

    expect(response.status).to.equal(401);
    expect(response.data).to.have.property("message");
    expect(response.data).to.have.property("code");
    expect(response.data).to.have.property("details");
    expect(response.data.message).to.equal(
      "Credenciais Inválidas"
    );

  });
})

describe("POST /login - Incorrect Password", () => {
  it("Should return an error if the password is incorrect", async () => {
    const mockUser = {
      name: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      birthDate: new Date("2000-01-01"),
    };

    const hashedPassword = await bcrypt.hash(mockUser.password, 10);
    await prisma.user.create({
      data: { ...mockUser, password: hashedPassword },
    });

    const response = await axios.post(`http://localhost:${port}/auth`, {
      email: mockUser.email, password: "Password321"
    }, { validateStatus: () => true });

    expect(response.status).to.equal(401);
    expect(response.data).to.have.property("message");
    expect(response.data).to.have.property("code");
    expect(response.data).to.have.property("details");
    expect(response.data.message).to.equal(
      "Credenciais Inválidas"
    );
  });
});
