export interface UserEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  birthDate: Date;
  address: Address[];
}

export interface Address {
  id: number,
  cep: string,
  street: string,
  streetNumber: string,
  complement?: string,
  neighborhood: string,
  city: string,
  state: string,
}
