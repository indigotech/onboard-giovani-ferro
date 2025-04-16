import { UserResponse } from "../models/user-response.types";
import { getUserById, getUsers } from "../repository/db-repository";

export async function findUsersHandler(): Promise<UserResponse[]> {
  const users = await getUsers()

  const userResponse: UserResponse[] = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
  }))

  return userResponse;
}

export async function findUserByIdHandler(id: number): Promise<UserResponse> {
  const user = await getUserById(id)

  const userResponse: UserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
  }

  return userResponse;
}
