import { defineEventHandler, proxyRequest } from "h3";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const backendBaseUrl = runtimeConfig.backendServerUrl;

  const path = event.context.params?.path || "";
  const serverToken = '1234567890';

  if (!serverToken) {
    return {
      code: "403",
      data: null,
      status: "unauthenticated!",
      message: "请先登录！",
    };
  }

  // 设置请求头
  const headers = {
    Authorization: `Bearer ${serverToken}`,
    ...event.headers,
  };

  // 转发请求
  return proxyRequest(event, `${backendBaseUrl}/${path}`, { headers });
});
