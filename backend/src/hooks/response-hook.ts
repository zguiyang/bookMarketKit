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
 * Fastify onSend Hook callback
 * must be async function!!!
 *
 * Executes when the response is about to be sent to the client.
 * Suitable for scenarios where various payload types (including string, null) need to be processed and modified before final delivery.
 */
export async function onSendHookHandler(request: FastifyRequest, reply: FastifyReply, payload: any): Promise<any> {
  const url = request.raw.url;
  if (url && url.startsWith('/docs')) {
    // If it's a Swagger UI request, return the original payload without modification
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
    // TODO: Data processing needs optimization
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
