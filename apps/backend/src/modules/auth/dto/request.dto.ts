import { z } from 'zod';

export const LoginParamsSchema = z.object({
  email: z
    .string({
      message: '邮箱为必填项',
    })
    .email({
      message: '邮箱格式不正确',
    }),
  password: z.string({
    message: '登录密码为必填项',
  }),
});

export type LoginParamsDTO = z.infer<typeof LoginParamsSchema>;
