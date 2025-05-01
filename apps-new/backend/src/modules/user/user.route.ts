import type { FastifyInstance } from 'fastify';

import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { userSchemas, CreateUserBody, UserIdParam } from '@bookmark/schemas';

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