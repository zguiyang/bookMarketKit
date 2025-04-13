export class ApiResponse<T = any> {
  success: boolean;
  code: string | number;
  data: T;
  message: string;
  timestamp?: string;
  path?: string;
  error?: any;
}

export type PartialApiResponse<T> = Partial<ApiResponse<T>>;

export type PromisePartialApiResponse<T> = Promise<PartialApiResponse<T>>;
export type PromiseApiResponse<T> = Promise<ApiResponse<T>>;
