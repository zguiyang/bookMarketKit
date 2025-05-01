import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { app, bootstrap } from '../../../src/bootstrap';
import type { CreateUserBody } from '@bookmark/schemas';

describe('User Routes', () => {
  beforeAll(async () => {
    await bootstrap();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /user/create', () => {
    const validUser: CreateUserBody = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should create a new user with valid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: validUser
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.code).toBe(0);
      expect(result.data).toHaveProperty('id');
      expect(result.data.username).toBe(validUser.username);
      expect(result.data.email).toBe(validUser.email);
    });

    it('should fail with invalid data', async () => {
      const invalidUser = {
        username: 'test',
        // missing email and password
      };

      const response = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: invalidUser
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /user/all', () => {
    it('should return all users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/user/all'
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.code).toBe(0);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('GET /user/detail/:id', () => {
    it('should return user details for valid ID', async () => {
      // 首先创建一个用户
      const createResponse = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: {
          username: 'detailtest',
          email: 'detail@example.com',
          password: 'password123'
        }
      });
      
      const { data: { id } } = JSON.parse(createResponse.payload);

      const response = await app.inject({
        method: 'GET',
        url: `/user/detail/${id}`
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.code).toBe(0);
      expect(result.data).toHaveProperty('id', id);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/user/detail/nonexistentid'
      });

      expect(response.statusCode).toBe(404);
    });
  });
}); 