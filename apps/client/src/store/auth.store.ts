import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { LoginUserInfoResponse } from '@/api/auth';

export interface AuthStore {
    token: string | null;
    userInfo:null | LoginUserInfoResponse;
    setToken: (token: string) => void;
    removeToken: () => void;
    setUserInfo: (userInfo: { username?: string; }) => void;
    removeUserInfo: () => void;
}

const AUTH_STORE_PERSIST_KEY = 'BOOK_MARKET_KIT_AUTH_STORE';
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            token: null,
            userInfo: null,
            setToken: (token) => set({
                token,
            }),
            removeToken: () => set({ token: null }),
            setUserInfo: (info: any) => set({ userInfo:info }),
            removeUserInfo: () => set({ userInfo: null }),
        }),
        {
            name: AUTH_STORE_PERSIST_KEY,
        }
    )
)