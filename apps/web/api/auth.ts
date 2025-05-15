import request from '@/lib/request';
import { ApiResponse } from '@bookmark/schemas';

class Auth {
  register(data: any) {
    return request.Post<ApiResponse<any>>('/auth/register', data);
  }

  getValidationCode(email: string) {
    return request.Get<ApiResponse<any>>('/auth/getEmailCode', {
      params: { email },
    });
  }

  login(data: any) {
    return request.Post<ApiResponse<string>>('/auth/sign-in', data);
  }

  logout() {
    return request.Delete<ApiResponse<any>>('/auth/logout');
  }

  queryCurrentUser() {
    return request.Get<ApiResponse<any>>('/auth/currentUser');
  }
}

export const AuthApi = new Auth();
