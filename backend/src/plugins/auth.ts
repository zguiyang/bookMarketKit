import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { fromNodeHeaders } from 'better-auth/node';
// import type { SessionUser } from '@bookmark/auth';
import { auth } from '@bookmark/auth';

export default fp(async (fastify) => {
  fastify.decorateRequest('currentUser', null);

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.url.startsWith('/auth')) {
      // 验证路由不需要验证
      return;
    }
    const authSession = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!authSession) {
      return reply.code(401).send({
        message: 'Unauthorized',
      });
    }

    request.currentUser = authSession.user;
  });

  if (fastify.auth) {
    return;
  }

  try {
    fastify.decorate('auth', auth);
  } catch (err: any) {
    fastify.log.error(`Auth Plugin Error: ${err.message}`, err);
  }
});
