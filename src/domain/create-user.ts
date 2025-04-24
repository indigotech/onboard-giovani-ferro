import bcrypt from "bcrypt";
import { BadRequestEsception } from "../exceptions/bad-request-exception";
import { UserRequest } from "../models/user-request.types";
import { UserResponse } from "../models/user-response.types";
import { createUser } from "../repository/db-repository";
import { userResponseMapper } from "../shared/user-response-mapper";
import { isStrongPassword } from "../shared/user-validation";

const SALT_ROUNDS = 10;

export async function createUserHandler(userCommand: UserRequest): Promise<UserResponse> {

  if (!isStrongPassword(userCommand.password)) {
    const message = "A senha deve ter pelo menos 6 caracteres e conter pelo menos 1 letra e 1 dígito"
    const code = "WEAK_PASSWORD"
    throw new BadRequestEsception({ message, code });
  }

  const userRequest: UserRequest = await encryptPassword(userCommand as UserRequest)

  const user = await createUser(userRequest);

  const userResponse = userResponseMapper(user);

  return userResponse
}

async function encryptPassword(user: UserRequest): Promise<UserRequest> {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

  return {
    ...user,
    password: hashedPassword
  }
}
