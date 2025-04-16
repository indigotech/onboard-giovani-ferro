import { UserResponse } from "./user-response.types";

export interface AuthResponse {
  user: User;
  token: string;
}

type User = UserResponse;
