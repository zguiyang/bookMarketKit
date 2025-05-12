export interface ApiResponse<T = unknown> {
    success: boolean;
    code: string | number;
    data: T;
    message: string;
    timestamp?: string;
    path?: string;
    error?: Error | null;
}