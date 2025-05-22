import { createAlova } from 'alova';
import reactHook from 'alova/react';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '@bookmark/schemas';
import { CodeEnums } from '@bookmark/code-definitions';

import { toast } from 'sonner';

const alovaInstance = createAlova({
  baseURL: `${process.env.NEXT_PUBLIC_WEB_URL}/api`,
  timeout: 60000,
  cacheFor: null,
  statesHook: reactHook,

  requestAdapter: axiosRequestAdapter(),
  beforeRequest(method) {
    method.config.withCredentials = true;
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
    onError(error: AxiosError<ApiResponse>) {
      console.error('An error occurred', error);
      const responseData = error.response?.data;
      if (responseData) {
        if (responseData.code === CodeEnums.AUTH_LOGIN_EXPIRED) {
          toast.error('登录已过期，请重新登录');
          window.location.href = '/auth/sign-in';
        }
      }
    },
  },
});

export default alovaInstance;
