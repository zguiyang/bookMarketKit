import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from 'drizzle-zod';
import { z } from 'zod';

import { usersTable } from '@/db/schemas';

export const insertUserSchema = createInsertSchema(usersTable, {
  username: z
    .string({
      message: '用户名称为必填项',
    })
    .min(2, { message: '用户名称不能小于两字符' })
    .max(60, { message: '用户名称不能大于60字符' }),
  email: z
    .string({
      message: '邮箱为必填项',
    })
    .email({ message: '请输入正确的邮箱' })
    .max(100, { message: '邮箱不能大于100字符' }),
  password: z
    .string({
      message: '密码为必填项',
    })
    .min(6, { message: '密码不能小于6字符' })
    .max(255, { message: '密码不能大于255字符' }),
});

export const updateUserSchema = createUpdateSchema(usersTable);
export const selectUserSchema = createSelectSchema(usersTable);
