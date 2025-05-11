import { saveToStorage, getFromStorage, removeFromStorage } from './storage'

// 存储键名
const TOKEN_KEY = 'BOOK_MARKET_KIT_TOKEN';

// 保存 token
export function saveToken(token: string): void {
    saveToStorage(TOKEN_KEY, token);
}

// 获取 token
export function getToken(): string | null {
    return getFromStorage<string | null>(TOKEN_KEY, null);
}

// 删除 token
export function removeToken(): void {
    removeFromStorage(TOKEN_KEY);
}