import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ApiResponse } from '~shared/schemas';

export default function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  const response: ApiResponse = {
    code: 404,
    success: false,
    message: `接口不存在: ${request.url}`,
    data: null,
  };
  return reply.status(404).send(response);
}
