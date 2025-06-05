import type { SessionUser } from '@bookmark/auth';

import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '@bookmark/auth';
import { authCodeMessages } from '@bookmark/code-definitions';
import { BusinessError } from '@/lib/business-error';

export default fp(async (fastify) => {
  fastify.decorateRequest<SessionUser | null>('currentUser', null);

  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    if (request.url.startsWith('/auth') || request.url.startsWith('/docs')) {
      // Authentication routes do not require validation
      return;
    }
    const authSession = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!authSession) {
      throw new BusinessError(authCodeMessages.expired);
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
