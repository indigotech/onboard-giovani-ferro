import bcrypt from "bcrypt";
import { invalidParameterException } from "../exceptions/bad-request-exception";
import { UserRequest } from "../models/user-request.types";
import { UserResponse } from "../models/user-response.types";
import { createUser } from "../repository/db-repository";
import { isStrongPassword } from "../shared/user-validation";

const SALT_ROUNDS = 10;

export async function createUserHandler(userCommand: UserRequest): Promise<UserResponse> {

  if (!isStrongPassword(userCommand.password)) {
    const message = "A senha deve ter pelo menos 6 caracteres e conter pelo menos 1 letra e 1 dígito"
    const code = "WEAK_PASSWORD"
    return invalidParameterException({ message, code });
  }

  const userRequest: UserRequest = await encryptPassword(userCommand as UserRequest)

  const user = await createUser(userRequest);

  const userResponse: UserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
  };

  return userResponse
}

async function encryptPassword(user: UserRequest): Promise<UserRequest> {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

  return {
    ...user,
    password: hashedPassword
  }
}
