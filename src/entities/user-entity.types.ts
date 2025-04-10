export interface UserRequest {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UserEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  birthDate: Date;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
}
