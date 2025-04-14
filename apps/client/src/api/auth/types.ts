export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    emailCode: string;
    nickname?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginUserInfoResponse {
    authToken: string;
    email: string;
    id: string;
    nickname: null | string;
    username: string;
}