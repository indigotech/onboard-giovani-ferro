import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../models/auth-request.types";
import { AuthResponse } from "../models/auth-response.types";
import { getUserByEmail } from "../repository/db-repository";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION ? +process.env.JWT_EXPIRATION : 900

export async function authenticationHandler(authCommand: AuthRequest): Promise<AuthResponse> {
  const { email, password } = authCommand;

  const user = await getUserByEmail(email);

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new Error("Credenciais do usuário incorretas");
  }

  const token = jwt.sign(
    { email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  const userResponse: AuthResponse = {
    user: {
      id: user.id,
      name: user.name,
      birthDate: user.birthDate,
      email: user.email
    },
    token: token
  }

  return userResponse;
}

function comparePassword(password: string, hashedPassword: string): Promise<Boolean> {
  return bcrypt.compare(password, hashedPassword)
}
