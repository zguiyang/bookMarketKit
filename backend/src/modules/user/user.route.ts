import type { FastifyInstance } from 'fastify';
import type { CreateUserBody, UserIdParam } from '@bookmark/schemas';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userSchemas } from './user.schema';

export default async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService();
  const userController = new UserController(userService);

  fastify.post<{ Body: CreateUserBody }>('/create', {
    schema: userSchemas.create,
    handler: (req) => userController.create(req),
  });

  fastify.get('/all', {
    schema: userSchemas.all,
    handler: () => userController.all(),
  });

  fastify.get<{ Params: UserIdParam }>('/detail/:id', {
    schema: userSchemas.findOne,
    handler: (req) => userController.findOne(req),
  });
}
