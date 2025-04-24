import { UserResponse } from "../models/user-response.types";
import { getUserById, getUsers } from "../repository/db-repository";
import { userResponseMapper } from "../shared/user-response-mapper";

export async function findUsersHandler(): Promise<UserResponse[]> {
  const users = await getUsers()

  const userResponse: UserResponse[] = users.map(user => userResponseMapper(user))

  return userResponse;
}

export async function findUserByIdHandler(id: number): Promise<UserResponse> {
  const user = await getUserById(id)

  const userResponse = userResponseMapper(user);

  return userResponse;
}
