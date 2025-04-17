import { create } from 'zustand'
import { AuthApi, LoginUserInfoResponse } from '@/api/auth';
import { getToken, saveToken, removeToken } from '@/lib/auth'

export interface AuthStore {
    authToken: string | null;
    userInfo:null | LoginUserInfoResponse;
    setAuthToken: (token: string) => void;
    removeAuthToken: () => void;
    setUserInfo: (userInfo: LoginUserInfoResponse | null) => void;
    queryUserInfo: () => Promise<void>;
    logout: () => Promise<void>;
    clearAuthInfo: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    authToken: getToken(),
    userInfo: null,
    setAuthToken: (token: string) => {
        saveToken(token);
        return set({
            authToken: token,
        })
    },
    removeAuthToken: () => {
        removeToken()
        return set({
            authToken: null,
        })

    },
    async queryUserInfo() {
      try {
          const { success, data } = await AuthApi.queryCurrentUser();
          if (success && data) {
             get().setUserInfo(data);
          } else {
              get().clearAuthInfo();
          }
      } catch (err) {
          console.error(err);
          get().clearAuthInfo();
      }
    },
    setUserInfo: (userInfo: LoginUserInfoResponse | null) => {
        return set({
            userInfo,
        })
    },
    async logout( callback?: () => void) {
      const { success } = await AuthApi.logout();
      if (success) {
          get().clearAuthInfo();
          callback && callback()
      }
    },
    clearAuthInfo: () => {
        get().removeAuthToken();
        get().setUserInfo(null);
    }
}))