import { UserResponse } from "../models/user-response.types";
import { getUserById, getUsers } from "../repository/db-repository";
import { userResponseBuilder } from "../shared/user-response-builder";

export async function findUsersHandler(): Promise<UserResponse[]> {
  const users = await getUsers()

  const userResponse: UserResponse[] = users.map(user => userResponseBuilder(user))

  return userResponse;
}

export async function findUserByIdHandler(id: number): Promise<UserResponse> {
  const user = await getUserById(id)

  const userResponse = userResponseBuilder(user);

  return userResponse;
}
