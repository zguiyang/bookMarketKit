import type { FastifyRequest, FastifyReply } from 'fastify';
import { createAuthInstance } from '@/core/auth';
import { authCodeMessages } from '@bookmark/code-definitions';

export class AuthController {
  constructor(private readonly AuthInstance: ReturnType<typeof createAuthInstance>) {}

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

      const response = await this.AuthInstance.handler(authReq);

      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
      return {
        code: response.status,
        data: response.body ? await response.text() : null,
      };
      // if (response.status !== 200) {
      //   throw new BusinessError({
      //     code: authCodeMessages.authFailed.code,
      //     message: response.statusText || authCodeMessages.authFailed.message,
      //   });
      // }
      // return response.body;
    } catch (error: any) {
      // throw new BusinessError({
      //   code: authCodeMessages.authFailed.code,
      //   message: error.message || authCodeMessages.authFailed.message,
      // });
      reply.status(500).send({
        error: error.message || authCodeMessages.authFailed.message,
        code: authCodeMessages.authFailed.code,
      });
    }
  }
}
