import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '@/services/user/user.service';
import { UserModel } from '@/models/user.model';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await userService.create(userData);

      expect(user).toHaveProperty('id');
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      // 密码应该被排除
      expect(user).not.toHaveProperty('password');
    });

    it('should hash the password before saving', async () => {
      const userData = {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
      };

      // 直接从数据库获取用户以检查密码哈希
      const user = await UserModel.create(userData);
      expect(user.password).not.toBe(userData.password);

      // 清理测试数据
      await UserModel.deleteOne({ _id: user._id });
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      // 先创建一些测试用户
      await userService.create({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
      });

      await userService.create({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
      });

      const users = await userService.getAll();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThanOrEqual(2);
      // 验证密码字段被排除
      users.forEach((user) => {
        expect(user).not.toHaveProperty('password');
      });
    });
  });

  describe('getById', () => {
    it('should find user by id', async () => {
      const userData = {
        username: 'finduser',
        email: 'find@example.com',
        password: 'password123',
      };

      const createdUser = await userService.create(userData);
      const foundUser = await userService.getById(createdUser._id);

      expect(foundUser).toBeDefined();
      expect(foundUser?._id).toBe(createdUser._id);
      expect(foundUser?.username).toBe(userData.username);
      // 验证密码字段被排除
      expect(foundUser).not.toHaveProperty('password');
    });

    it('should return null for non-existent user', async () => {
      const foundUser = await userService.getById('nonexistentid');
      expect(foundUser).toBeNull();
    });
  });
});
