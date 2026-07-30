export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest{
    email: string;
    name: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: User
}