"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterFormValues, registerSchema } from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      verificationCode: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    try {
      // TODO: 实现注册逻辑
      console.log(data)
      router.push("/auth/login")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendVerificationCode() {
    const email = form.getValues("email")
    if (!email || !form.trigger("email")) {
      return
    }

    setIsSendingCode(true)
    try {
      // TODO: 实现发送验证码逻辑
      console.log("发送验证码到:", email)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSendingCode(false)
    }
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入用户名"
                    className="h-11"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="请输入邮箱"
                    className="h-11"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    className="h-11"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>验证码</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input
                      placeholder="请输入验证码"
                      className="h-11"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    variant="outline"
                    className="h-11 w-32 shrink-0"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode || isLoading}
                  >
                    {isSendingCode ? "发送中..." : "发送验证码"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90" 
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