export interface ApiResponse<T = any> {
    success: boolean;
    code: string | number;
    data: T;
    message: string;
    timestamp?: string;
    path?: string;
    error?: any;
}