import axios from "axios";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import { prisma } from "../../src/client/client";

const port = process.env.PORT ? +process.env.PORT : 30002;
const JWT_SECRET = process.env.JWT_SECRET!;

describe('GraphQL - Query user', () => {
  const token = jwt.sign({ id: "123" }, JWT_SECRET, { expiresIn: "1h" });

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

  const query = `
    query User($id: Int!) {
      user(id: $id) {
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

  it('Should return user information for a valid id and token', async () => {
    const user = await prisma.user.create({
      data: {
        ...mockUser,
        birthDate: new Date(mockUser.birthDate),
        addresses: { create: mockUser.addresses }
      }
    })

    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      {
        query,
        variables: { id: user.id }
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true
      }
    );

    expect(response.status).to.equal(200);
    expect(response.data.data.user).to.deep.equal({
      id: user.id,
      name: "testuser",
      email: "mockuser@example.com",
      birthDate: new Date("2000-01-01").getTime().toString(),
      addresses: [
        {
          id: response.data.data.user.addresses[0].id,
          cep: "12345-678",
          street: "Test Street",
          streetNumber: "123",
          neighborhood: "Test Neighborhood",
          city: "Test City",
          state: "SP",
          complement: null
        }
      ]
    });
  });

  it('Should return an error if the user is not found', async () => {
    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      {
        query,
        variables: { id: 99999 }
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true
      }
    );

    expect(response.status).to.equal(200);
    expect(response.data.errors[0]).to.be.deep.equal({
      message: "O usuário não foi encontrado no sistema",
      locations: response.data.errors[0].locations,
      path: response.data.errors[0].path,
      extensions: {
        code: "USER_NOT_FOUND"
      }
    });
  });

  it('Should return an error if the Authorization header is missing', async () => {
    const user = await prisma.user.create({
      data: {
        ...mockUser,
        birthDate: new Date(mockUser.birthDate),
        addresses: { create: mockUser.addresses }
      }
    })

    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      {
        query,
        variables: { id: user.id }
      },
      { validateStatus: () => true }
    );

    expect(response.status).to.equal(200);
    expect(response.data.errors[0]).to.be.deep.equal({
      message: "O cabeçalho de autorização está ausente ou é inválido",
      locations: response.data.errors[0].locations,
      path: response.data.errors[0].path,
      extensions: {
        code: "INVALID_AUTHENTICATION",
        details: "The token does not exists or has invalid format."
      }
    });
  });

  it('Should return an error if the token is invalid', async () => {
    const user = await prisma.user.create({
      data: {
        ...mockUser,
        birthDate: new Date(mockUser.birthDate),
        addresses: { create: mockUser.addresses }
      }
    })

    const response = await axios.post(
      `http://localhost:${port}/graphql`,
      {
        query,
        variables: { id: user.id }
      },
      {
        headers: { Authorization: `Bearer invalid.token.here` },
        validateStatus: () => true
      }
    );

    expect(response.status).to.equal(200);
    expect(response.data.errors[0]).to.be.deep.equal({
      message: "O Token não é válido ou está expirado",
      locations: response.data.errors[0].locations,
      path: response.data.errors[0].path,
      extensions: {
        code: "INVALID_AUTHENTICATION"
      }
    });
  });
});
