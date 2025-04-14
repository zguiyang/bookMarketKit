import request from "@/lib/request";
import { ApiResponse } from '@/types/response';
import { RegisterRequest, LoginRequest, LoginUserInfoResponse } from './types';

class Auth {
     register(data: RegisterRequest) {
        return request.Post<ApiResponse<any>>('/auth/register', data);
    }

     login (data: LoginRequest) {
        return  request.Post<ApiResponse<string>>('/auth/login', data);
    }

     logout () {
        return request.Delete('/auth/logout');
    }

     queryCurrentUser () {
        return request.Get<ApiResponse<LoginUserInfoResponse>>('/auth/currentUser');
    }
}

export const AuthApi = new Auth();