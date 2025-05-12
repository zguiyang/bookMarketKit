import { createAlova } from 'alova';
import reactHook from 'alova/react';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '@bookmark/schemas';

import { toast } from 'sonner';

const alovaInstance = createAlova({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  timeout: 60000,
  cacheFor: null,
  statesHook: reactHook,
  requestAdapter: axiosRequestAdapter(),
  beforeRequest(method) {
    method.config.headers.Authorization = `Bearer 123`;
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
    },
  },
});

export default alovaInstance;
