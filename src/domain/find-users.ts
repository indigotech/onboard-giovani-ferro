import { UserResponse } from "../models/user-response.types";
import { getUsers } from "../repository/db-repository";

export async function findUsers(): Promise<UserResponse[]> {
  const users = await getUsers()

  const userResponse: UserResponse[] = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
  }))

  return userResponse;
}
