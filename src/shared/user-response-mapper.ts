import { UserEntity } from "../entities/user-entity.types";
import { UserResponse } from "../models/user-response.types";

export function userResponseMapper(user: UserEntity) {
  const userResponse: UserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
    addresses: user.addresses
  }

  return userResponse;
}
