import * as z from "zod"

export const loginSchema = z.object({
    email: z.string().email({
        message: "请输入有效的邮箱地址",
    }),
    password: z.string({
        required_error: '请输入登录密码'
    }),
})

export type LoginFormValues = z.infer<typeof loginSchema>