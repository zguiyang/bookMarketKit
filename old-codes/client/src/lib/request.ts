import { createAlova } from 'alova';
import reactHook from 'alova/react';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import type { AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import type { ApiResponse } from '@/types/response';

import { toast } from "sonner"

const alovaInstance = createAlova({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 60000,
    cacheFor: null,
    statesHook:reactHook,
    requestAdapter: axiosRequestAdapter(),
    beforeRequest(method) {
        const authToken = useAuthStore.getState().authToken;
        method.config.headers.Authorization = `Bearer ${authToken}`
    },
    responded: {
        onSuccess(response: AxiosResponse) {
            const responseData = response.data as ApiResponse;

            if (!responseData.success) {
                toast.error(responseData.message);
                console.error(responseData.error);
            }
            return responseData;
        },
        onError(error: AxiosError) {
            console.error('An error occurred', error);
        }
    }
});

export default alovaInstance;