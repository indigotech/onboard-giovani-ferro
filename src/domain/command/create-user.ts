import bcrypt from "bcrypt";
import { UserRequest } from "../../models/request/user/user-request.types";
import { UserResponse } from "../../models/response/user/user-response.types";
import { createUser } from "../../repository/db-repository";

const SALT_ROUNDS = 10;

export async function createUserHandler(userCommand: UserRequest): Promise<UserResponse> {
  const userRequest: UserRequest = await EncryptPassword(userCommand as UserRequest)

  const user = await createUser(userRequest);

  const userResponse: UserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
  };

  return userResponse
}

async function EncryptPassword(user: UserRequest): Promise<UserRequest> {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

  return {
    ...user,
    password: hashedPassword
  }
}
