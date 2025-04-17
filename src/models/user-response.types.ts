export interface UserResponse {
    id: number;
    name: string;
    email: string;
    birthDate: Date;
}


export interface PaginatedResponse {
    users: UserResponse[],
    pagination: {
        total: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }
}
