import bcrypt from "bcrypt";
import { AuthRequest } from "../models/auth-request.types";
import { AuthResponse } from "../models/auth-response.types";
import { getUserByEmail } from "../repository/db-repository";

const SALT_ROUNDS = 10;

export async function authenticationHandler(authCommand: AuthRequest): Promise<AuthResponse> {
  const { email, password } = authCommand;

  const user = await getUserByEmail(email);

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new Error("Credenciais do usuário incorretas");
  }

  const userResponse: AuthResponse = {
    user: {
      id: user.id,
      name: user.name,
      birthDate: user.birthDate,
      email: user.email
    },
    token: "idhadedmaomuh72y27idai.daiehdeuyihd7428hiqdakbaSDEDEHYDGa.AODdaljed4347SJBAah7e7"
  }

  return userResponse;
}

function comparePassword(password: string, hashedPassword: string): Promise<Boolean> {
  return bcrypt.compare(password, hashedPassword)
}
