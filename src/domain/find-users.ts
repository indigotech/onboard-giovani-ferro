import { PaginatedRequest } from "../models/user-request.types";
import { PaginatedResponse, UserResponse } from "../models/user-response.types";
import { getUserById, getUsers } from "../repository/db-repository";
import { userResponseMapper } from "../shared/user-response-mapper";

export async function findUsersHandler(query: PaginatedRequest): Promise<PaginatedResponse> {
  const users = await getUsers(query)

  return users;
}

export async function findUserByIdHandler(id: number): Promise<UserResponse> {
  const user = await getUserById(id)

  const userResponse = userResponseMapper(user);

  return userResponse;
}

