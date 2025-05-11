import { ofetch } from 'ofetch';
import type { ApiResponse } from '@bookmark/schemas';
import { CodeEnums } from '@bookmark/code-definitions';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const toast = useToast();
  const apiBaseUrl = runtimeConfig.public.apiBaseUrl;

  if (!apiBaseUrl) {
    throw new Error('apiBaseUrl is not set');
  }

  const apiFetcher = ofetch.create({
    baseURL: apiBaseUrl as string,

    headers: {
      'Content-Type': 'application/json',
    },

    onRequest({ request, options }) {
      console.log('[fetch request]', request, options);
      // 假设 token 存在 Pinia store 或 localStorage 中
      // const authStore = useAuthStore(); // 示例：使用 Pinia
      // const token = authStore.token;
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null; // 仅在客户端获取
      if (token) {
        options.headers = new Headers(options.headers); // 确保是 Headers 对象
        options.headers.set('Authorization', `Bearer ${token}`);
      }
    },
    onRequestError({ request, options, error }) {
      console.error('[fetch request request error]', request);
      console.error('[fetch request options error]', options);
      console.error('[fetch request error]', error);
      toast.add({
        title: '请求失败',
        description: error.message ?? '发送请求失败',
        color: 'error',
      });
    },

    onResponse({ response }) {
      const apiData = response._data as ApiResponse<any> | null;

      if (apiData) {
        if (apiData.code !== CodeEnums.COMMON_SUCCESSFUL) {
          toast.add({
            title: apiData.message,
            description: apiData.data ? JSON.stringify(apiData.data) : apiData.message,
            color: 'error',
          });
        }
      } else {
        console.error('apiData is null', response);
      }
    },

    // 2. 错误拦截器：处理 HTTP 错误 (4xx, 5xx) 或网络错误
    onResponseError({ request, response, error }) {
      console.error('[fetch response error]', request, response?.status, response?._data, error);

      // 在这里可以做统一的错误处理
      // 例如：根据状态码进行操作
      if (response?.status === 401) {
        // 处理未授权，例如跳转到登录页
        console.error('Unauthorized! Redirecting to login...');
        // navigateTo('/login'); // 需要确保在合适的上下文调用
      } else if (response?.status === 404) {
        console.error('Resource not found.');
      } else {
        // 其他 HTTP 错误或网络错误
        // 可以显示全局错误通知
        // showGlobalErrorToast(response?._data?.message || error?.message || '请求失败');
      }
      // 可以选择向上抛出错误，让调用处也能感知到
      // return Promise.reject(error);
    },
    // 默认忽略 refetch 警告 (如果需要可以开启)
    // ignoreResponseError: true,
  });
  return {
    provide: {
      api: apiFetcher,
    },
  };
});
