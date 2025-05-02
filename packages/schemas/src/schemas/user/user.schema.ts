import { z } from 'zod';

export const createUserBodySchema = z.object({
  username: z.string().min(1, { message: '用户名不能为空' }),
  email: z.string().email({ message: '邮箱格式不正确' }),
  password: z.string().min(6, { message: '密码至少6位' }),
}).strict();

export const userIdParamSchema = z.object({
  id: z.string().min(1, { message: '用户ID不能为空' }),
});

export const userResponseSchema = z.object({
  _id: z.string(),
  username: z.string(),
  nickname: z.string().optional(),
  email: z.string().email(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const allUsersResponseSchema = z.array(userResponseSchema);

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type AllUsersResponse = z.infer<typeof allUsersResponseSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
