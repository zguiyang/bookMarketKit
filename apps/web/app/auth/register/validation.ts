import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string({
        required_error: '用户名不能为空'
    }).max(64, '用户名称不能超过64个字符'),
    email: z.string()
        .min(1, "邮箱不能为空")
        .email("请输入有效的邮箱地址"),
    emailCode: z.string()
        .min(1, "邮箱验证码不能为空")
        .length(6, "验证码必须是6位数字")
        .regex(/^\d+$/, "验证码只能包含数字"),
    password: z.string()
        .min(6, "密码长度至少 6位")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "密码必须包含字母和数字"),
    nickname: z.string()
        .max(50, "昵称不能超过50个字符")
        .optional(),
})

export type RegisterFormValues = z.infer<typeof registerSchema>