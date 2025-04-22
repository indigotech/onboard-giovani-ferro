
export interface UserRequest {
    name: string;
    email: string;
    password: string;
    birthDate: string;
}


export interface PaginatedRequest {
    page: number;
    pageSize: number;
}
