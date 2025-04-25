
interface AddressRequest {
    cep: string,
    street: string,
    streetNumber: string,
    complement: string | null,
    neighborhood: string,
    city: string,
    state: string,
};

export interface UserRequest {
    name: string;
    email: string;
    password: string;
    birthDate: string;
    addresses: AddressRequest[];
}

export interface PaginatedRequest {
    page: number;
    pageSize: number;
}
