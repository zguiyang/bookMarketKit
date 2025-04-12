import { z } from 'zod';
import { insertUserSchema } from '@/modules/user/dto/schema.dto';

export const authRegisterSchema = insertUserSchema.merge(
  z
    .object({
      emailCode: z.string({
        required_error: '邮箱验证码不能为空',
      }),
    })
    .required(),
);

export type AuthRegisterDTO = z.infer<typeof authRegisterSchema>;

export const authLoginSchema = z.object({
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

export type AuthLoginDTO = z.infer<typeof authLoginSchema>;
