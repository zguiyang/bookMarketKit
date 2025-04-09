import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
  password: z.string().min(8, {
    message: "密码长度至少为8位",
  }),
})

export const registerSchema = z.object({
  username: z.string().min(2, {
    message: "用户名长度至少为2位",
  }),
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
  password: z.string().min(8, {
    message: "密码长度至少为8位",
  }),
  verificationCode: z.string().length(6, {
    message: "验证码长度必须为6位",
  }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema> 