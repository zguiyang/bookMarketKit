'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { OAuthButton } from '@/components/oauth-button';
import { Input } from '@/components/ui/input';

import { client } from '@/lib/auth/client';

import { LoginFormValues, loginSchema } from './validation';

export default function LoginPage() {
  const router = useRouter();
  // TODO: 临时处理, 后期优化
  const isEnableGithubLogin = process.env.NEXT_PUBLIC_GITHUB_LOGIN === '1';
  const isEnableGoogleLogin = process.env.NEXT_PUBLIC_GOOGLE_LOGIN === '1';

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const { error } = await client.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            router.push('/bookmarks');
          },
        }
      );

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">欢迎回来</h1>
        <p className="text-base text-muted-foreground">输入您的邮箱和密码登录</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="请输入邮箱" className="h-11" {...field} disabled={isLoading} />
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
                  <Input type="password" placeholder="请输入密码" className="h-11" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="h-11 w-full bg-gradient-to-r from-primary to-primary/80"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                登录中...
              </>
            ) : (
              <>登录</>
            )}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">或者</span>
          </div>
        </div>
        <div className={'mt-2 flex flex-col space-y-4'}>
          {isEnableGithubLogin && <OAuthButton provider={'github'} />}
          {isEnableGoogleLogin && <OAuthButton provider={'google'} />}
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          还没有账号？{' '}
          <Link href="/auth/sign-up" className="font-medium text-primary hover:text-primary/80">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}
