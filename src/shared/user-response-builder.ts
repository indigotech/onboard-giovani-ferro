import { UserEntity } from "../entities/user-entity.types";
import { UserResponse } from "../models/user-response.types";

export function userResponseBuilder(user: UserEntity) {
  const userResponse: UserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
  }

  return userResponse;
}
