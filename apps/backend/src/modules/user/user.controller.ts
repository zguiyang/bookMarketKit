import { FastifyRequest } from 'fastify';
import { CreateUserBody, UserResponse, UserIdParam } from '@bookmark/schemas';

import { UserService } from './user.service.js';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: FastifyRequest<{ Body: CreateUserBody }>): Promise<UserResponse> {
    return await this.userService.create(req.body);
  }

  async all(): Promise<UserResponse[]> {
    return await this.userService.getAll();
  }

  async findOne(req: FastifyRequest<{ Params: UserIdParam }>): Promise<UserResponse> {
    return await this.userService.getById(req.params.id);
  }
}
