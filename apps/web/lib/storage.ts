// 检查是否在客户端
const isClient = typeof window !== 'undefined';

// 保存数据到 localStorage
export function saveToStorage(key: string, value: any): void {
    if (isClient) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('保存到 localStorage 失败:', error);
        }
    }
}

export function getFromStorage<T>(key: string, defaultValue: T): T {
    if (!isClient) {
        return defaultValue;
    }

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('从 localStorage 获取数据失败:', error);
        return defaultValue;
    }
}

export function removeFromStorage(key: string): void {
    if (isClient) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('从 localStorage 删除数据失败:', error);
        }
    }
}
