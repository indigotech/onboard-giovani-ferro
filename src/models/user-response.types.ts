import { Address } from "../entities/user-entity.types";
import { User } from "./auth-response.types";

export interface UserResponse extends User {
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


export interface PaginatedResponse {
    users: UserResponse[],
    pagination: {
        total: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }
}
