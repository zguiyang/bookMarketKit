import { createAlova } from 'alova';
import reactHook from 'alova/react';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '@bookmark/schemas';
import { CodeEnums, commonCodeMessages } from '@bookmark/code-definitions';

import { toast } from 'sonner';

const alovaInstance = createAlova({
  baseURL: '/api',
  timeout: 60000,
  cacheFor: null,
  statesHook: reactHook,

  requestAdapter: axiosRequestAdapter(),
  beforeRequest(method) {
    method.config.withCredentials = true;
  },
  responded: {
    onSuccess(response: AxiosResponse) {
      const responseType = response.headers['x-response-type'];
      if (responseType === 'file-stream') {
        return {
          code: CodeEnums.COMMON_SUCCESSFUL,
          data: {
            file: response.data,
            name: response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, ''),
          },
          success: true,
          message: commonCodeMessages.success.message,
        };
      }

      const responseData = response.data as ApiResponse;

      if (!responseData.success) {
        console.error(responseData.error);
        toast.error(responseData.message || commonCodeMessages.fail.message);
      }
      return responseData;
    },
    onError(error: AxiosError<ApiResponse>) {
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
