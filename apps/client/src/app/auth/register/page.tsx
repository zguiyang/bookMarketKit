"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRequest } from 'alova/client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AuthApi } from '@/api/auth';

import { RegisterFormValues, registerSchema } from "./validation"

export default function RegisterPage() {
  const router = useRouter()
  const { send: getValidationCode } = useRequest(AuthApi.getValidationCode, {
      immediate: false,
  });
    const { send: postSubmitFormData } = useRequest(AuthApi.register, {
        immediate: false,
    });

  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
        emailCode: "",
      password: "",
      nickname: "",
        username: "",
    },
    mode: "onChange", // 启用实时验证
  })

  // 获取邮箱字段的验证状态
  const emailValue = form.watch("email")
  const emailError = form.formState.errors.email

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
        const { success } = await postSubmitFormData(data);

        if (success) {
            router.push("/auth/login")
        }
      setIsLoading(false)
  }

  async function handleSendVerificationCode() {
    const email = form.getValues("email")
    if (!email || !form.trigger("email")) {
      console.error('邮箱地址不能为空')
      return
    }

    setIsSendingCode(true)
    try {
        const { success } = await getValidationCode(email);
        if (success) {
            // 开始倒计时
            setCountdown(60)
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSendingCode(false)
    }
  }

  // 判断验证码按钮是否可用
  const isVerifyButtonDisabled = !emailValue || !!emailError || countdown > 0 || isSendingCode || isLoading

  // 获取验证码按钮的文本
  const getVerifyButtonText = () => {
    if (countdown > 0) return `${countdown}秒后重试`
    if (isSendingCode) return "发送中..."
    if (!emailValue) return "请输入邮箱"
    if (emailError) return "邮箱格式错误"
    return "获取验证码"
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          创建账号
        </h1>
        <p className="text-sm text-muted-foreground">
          填写以下信息创建您的新账号
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 邮箱字段 */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="请输入邮箱地址"
                    className="h-11"
                    autoComplete="email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  我们将向此邮箱发送验证码
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 邮箱验证码字段 */}
          <FormField
            control={form.control}
            name="emailCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱验证码</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input
                      placeholder="请输入验证码"
                      className="h-11"
                      maxLength={6}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className={`h-11 cursor-pointer w-32 shrink-0 transition-colors ${
                      isVerifyButtonDisabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                    onClick={handleSendVerificationCode}
                    disabled={isVerifyButtonDisabled}
                  >
                    {getVerifyButtonText()}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 密码字段 */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="请设置登录密码"
                    className="h-11"
                    autoComplete="new-password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1.5">
                  <FormDescription className="text-xs">
                    密码长度至少8位，包含字母和数字
                  </FormDescription>
                  <p className="text-xs text-yellow-500 dark:text-yellow-400">
                    注意：找回密码功能开发中，请牢记密码。如遗忘请联系管理员：2770723534@qq.com
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

            {/* 用户名称字段 */}
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            用户名称
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="请输入您的用户名称"
                                className="h-11"
                                {...field}
                                disabled={isLoading}
                            />
                        </FormControl>
                        <FormDescription className="text-xs">
                            设置一个唯一的用户名称，便于查询
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

          {/* 昵称字段（可选） */}
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  昵称
                  <span className="ml-1 text-xs text-muted-foreground">(选填)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入您的昵称"
                    className="h-11"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  设置一个昵称让其他用户更容易记住你
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="h-11 w-full" 
            disabled={isLoading}
          >
            {isLoading ? "注册中..." : "注册"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            或者
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        已有账号？{" "}
        <Link 
          href="/auth/login" 
          className="font-medium text-primary hover:text-primary/90 hover:underline"
        >
          立即登录
        </Link>
      </p>
    </div>
  )
} 