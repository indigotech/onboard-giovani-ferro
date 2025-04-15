export interface AuthResponse {
  user: User;
  token: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
}
