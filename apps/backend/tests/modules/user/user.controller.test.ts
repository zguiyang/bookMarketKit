import { describe, it, expect, beforeEach } from 'vitest';
import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';
import type { FastifyRequest } from 'fastify';
import type { CreateUserBody, UserIdParam } from '@bookmark/schemas';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    userController = new UserController(userService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const mockRequest = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        },
      } as FastifyRequest<{ Body: CreateUserBody }>;

      const result = await userController.create(mockRequest);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: mockRequest.body.username,
          email: mockRequest.body.email,
        })
      );
    });
  });

  describe('all', () => {
    it('should return all users', async () => {
      const result = await userController.all();

      expect(Array.isArray(result)).toBe(true);
      result.forEach((user) => {
        expect(user).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
          })
        );
      });
    });
  });

  describe('findOne', () => {
    it('should find user by id', async () => {
      // 先创建一个用户
      const createRequest = {
        body: {
          username: 'findtest',
          email: 'find@example.com',
          password: 'password123',
        },
      } as FastifyRequest<{ Body: CreateUserBody }>;

      const createdUser = await userController.create(createRequest);
      const userId = createdUser._id;

      const findRequest = {
        params: {
          id: userId,
        },
      } as FastifyRequest<{ Params: UserIdParam }>;

      const result = await userController.findOne(findRequest);

      expect(result).toEqual(
        expect.objectContaining({
          id: userId,
          username: createRequest.body.username,
          email: createRequest.body.email,
        })
      );
    });

    it('should return 404 for non-existent user', async () => {
      const findRequest = {
        params: {
          id: 'nonexistentid',
        },
      } as FastifyRequest<{ Params: UserIdParam }>;

      await expect(userController.findOne(findRequest)).rejects.toThrow();
    });
  });
});
