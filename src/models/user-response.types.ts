import { Address } from "../entities/user-entity.types";

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    birthDate: Date;
    addresses: UserAddress[]
}

type UserAddress = Address;

export interface PaginatedResponse {
    users: UserResponse[],
    pagination: {
        total: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }
}
