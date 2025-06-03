import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ApiResponse } from '@bookmark/schemas';
import { commonCodeMessages } from '@bookmark/code-definitions';

function isApiResponse(obj: any): obj is Partial<ApiResponse> {
  return (
    obj &&
    typeof obj === 'object' &&
    obj !== null &&
    ('code' in obj || 'message' in obj || 'data' in obj || 'success' in obj)
  );
}

/**
 * Fastify onSend Hook 回调
 * must be async function!!!
 *
 * 在响应即将发送给客户端时运行。
 * 适用于需要处理各种 payload 类型（包括 string, null）并进行最终修改的场景。
 */
export async function onSendHookHandler(request: FastifyRequest, reply: FastifyReply, payload: any): Promise<any> {
  const url = request.raw.url;
  if (url && url.startsWith('/docs')) {
    // 如果是 Swagger UI 的请求，直接返回原始 payload，不做任何修改
    return payload;
  }

  if (reply.statusCode < 200 || reply.statusCode >= 300) {
    return payload;
  }

  const responseType = reply.getHeader('X-Response-Type');
  if (responseType === 'file-stream') {
    return payload;
  }

  if (request.url.startsWith('/auth')) {
    // TODO: 需要优化数据处理
    return payload;
  }

  let objPayload = payload;

  if (typeof payload === 'string') {
    try {
      objPayload = JSON.parse(payload);
    } catch (e: any) {
      console.error('Failed to parse payload as JSON:', e.message);
      objPayload = null;
    }
  }

  if (isApiResponse(objPayload)) {
    const wrapped: ApiResponse = {
      code: 'code' in objPayload ? objPayload.code! : 0,
      success: 'success' in objPayload ? objPayload.success! : true,
      message: 'message' in objPayload ? objPayload.message! : 'success',
      data: 'data' in objPayload ? objPayload.data : null,
    };
    if (typeof payload === 'string' && !reply.getHeader('content-type')?.toString().includes('application/json')) {
      reply.header('content-type', 'application/json; charset=utf-8');
    }
    return JSON.stringify(wrapped);
  }

  const wrappedPayloadObject: ApiResponse = {
    code: commonCodeMessages.success.code,
    success: true,
    message: commonCodeMessages.success.message,
    data: objPayload,
  };

  const finalPayloadString = JSON.stringify(wrappedPayloadObject);

  reply.header('content-type', 'application/json; charset=utf-8');
  return finalPayloadString;
}
