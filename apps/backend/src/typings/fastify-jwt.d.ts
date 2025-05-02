import '@fastify/jwt';
import { FastifyJwtNamespace } from '@fastify/jwt';
 
declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'security' }> {}
} 