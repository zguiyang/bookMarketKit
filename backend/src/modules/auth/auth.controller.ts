import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authCodeMessages } from '@bookmark/code-definitions';

export class AuthController {
  constructor(private readonly fp: FastifyInstance) {}

  async bearerAuth(req: FastifyRequest, reply: FastifyReply) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const headers = new Headers();

      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });

      const authReq = new Request(url.toString(), {
        method: req.method,
        headers,
        body: req.body ? JSON.stringify(req.body) : undefined,
      });

      const response = await this.fp.auth.handler(authReq);

      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch (error: any) {
      reply.status(500).send({
        error: error.message || authCodeMessages.authFailed.message,
        code: authCodeMessages.authFailed.code,
      });
    }
  }
}
