export interface UserEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  birthDate: Date;
  addresses: Address[];
}

export interface Address {
  id: number,
  cep: string,
  street: string,
  streetNumber: string,
  complement: string | null,
  neighborhood: string,
  city: string,
  state: string,
  userId: number,
}
