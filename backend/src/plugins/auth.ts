import type { SessionUser } from '~shared/auth';

import type { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { fromNodeHeaders } from 'better-auth/node';
import { authInstance } from '~shared/auth/instance';
import { authCodeMessages } from '~shared/code-definitions/code-messages';
import { BusinessError } from '@/lib/business-error';

export default fp(async (fastify) => {
  fastify.decorateRequest<SessionUser | null>('currentUser', null);

  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    if (request.url.startsWith('/auth') || request.url.startsWith('/docs')) {
      // Authentication routes do not require validation
      return;
    }
    const authSession = await authInstance.api.getSession({
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
    fastify.decorate('auth', authInstance);
  } catch (err: any) {
    fastify.log.error(`Auth Plugin Error: ${err.message}`, err);
  }
});
