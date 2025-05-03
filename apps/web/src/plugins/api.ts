import { ofetch } from 'ofetch'
import type { ApiResponse } from '@bookmark/schemas'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const toast = useToast()
  const apiBaseUrl = runtimeConfig.public.apiBaseUrl

  if (!apiBaseUrl) {
    throw new Error('apiBaseUrl is not set')
  }

  const apiFetcher = ofetch.create({
    baseURL: apiBaseUrl as string,

    headers: {
      'Content-Type': 'application/json',
    },

    // 1 & 2. 请求拦截器：可以在发送前修改请求，例如添加 Token
    onRequest({ request, options }) {
      console.log('[fetch request]', request, options)
      // 假设 token 存在 Pinia store 或 localStorage 中
      // const authStore = useAuthStore(); // 示例：使用 Pinia
      // const token = authStore.token;
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null // 仅在客户端获取
      if (token) {
        options.headers = new Headers(options.headers) // 确保是 Headers 对象
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },
    onRequestError({ request, options, error }) {
      console.error('[fetch request request error]', request)
      console.error('[fetch request options error]', options)
      console.error('[fetch request error]', error)
      toast.add({
        title: '请求失败',
        description: error.message ?? '发送请求失败',
        color: 'error',
      })
    },

    // 2. 响应拦截器：在接收到响应后处理，可以统一处理数据结构或业务错误
    onResponse({ request, response }) {
      console.log('[fetch response]', request, response.status, response._data)
      // 从响应体中提取数据 (如果你的 API 有固定结构)
      const apiData = response._data as ApiResponse<any> // 类型断言

      // 检查业务错误码 (示例)
      if (apiData && apiData.code !== 0 && apiData.code !== 200) { // 假设 0 或 200 是成功
        console.error(`[API Business Error] Code: ${apiData.code}, Message: ${apiData.message}`, request)
        // 可以抛出一个自定义错误，或者进行其他处理 (如全局提示)
        // throw new Error(apiData.message || `API Error Code: ${apiData.code}`);
        // 注意：在 onResponse 中抛出错误会触发 onResponseError
        // 如果你希望在这里静默处理或转换数据，可以不抛错
      }

      // 自动解包 data 字段 (可选)
      // response._data = apiData.data;
      // 注意：如果这样做，后续获取数据时就直接是 data 字段的内容了
    },

    // 2. 错误拦截器：处理 HTTP 错误 (4xx, 5xx) 或网络错误
    onResponseError({ request, response, error }) {
      console.error('[fetch response error]', request, response?.status, response?._data, error)

      // 在这里可以做统一的错误处理
      // 例如：根据状态码进行操作
      if (response?.status === 401) {
        // 处理未授权，例如跳转到登录页
        console.error('Unauthorized! Redirecting to login...')
        // navigateTo('/login'); // 需要确保在合适的上下文调用
      } else if (response?.status === 404) {
        console.error('Resource not found.')
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
  })

  // 将配置好的 fetcher 注入到 Nuxt app 上下文中
  // 这样你可以在任何地方通过 useNuxtApp().$api 来访问
  return {
    provide: {
      api: apiFetcher,
    },
  }
})
