import { User } from '../interfaces/user';

declare module 'fastify' {
  interface FastifyRequest {
    currentUser: User;
    _currentUser?: User;
  }
}
