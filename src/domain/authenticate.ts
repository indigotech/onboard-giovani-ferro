import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { notAuthenticateException } from "../exceptions/not-authenticate-exception";
import { AuthRequest } from "../models/auth-request.types";
import { AuthResponse } from "../models/auth-response.types";
import { getUserByEmail } from "../repository/db-repository";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION ? +process.env.JWT_EXPIRATION : 86400
const JWT_EXPIRATION_EXTENDED = process.env.JWT_EXPIRATION_EXTENDED ? +process.env.JWT_EXPIRATION_EXTENDED : 604800;

export async function authenticationHandler(authCommand: AuthRequest): Promise<AuthResponse> {
  const { email, password, rememberMe } = authCommand;

  const user = await getUserByEmail(email);

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    notAuthenticateException({ message: "Credenciais do usuário incorretas.", details: "Password is not valid." });
  }

  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: rememberMe ? JWT_EXPIRATION_EXTENDED : JWT_EXPIRATION }
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
