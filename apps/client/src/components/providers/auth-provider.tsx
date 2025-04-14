'use client'

import { createContext, useCallback, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

// 定义认证上下文类型
interface AuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
  checkAuth: () => Promise<void>
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider属性类型
interface AuthProviderProps {
  children: React.ReactNode
  // 可选：如果未认证，重定向到此路径
  redirectTo?: string
  // 可选：是否在此组件挂载时立即检查认证状态，默认为true
  requireAuth?: boolean
}

export function AuthProvider({
  children,
  redirectTo = '/auth/login',
  requireAuth = true,
}: AuthProviderProps) {
  const router = useRouter()
  const { token, userInfo, removeToken, removeUserInfo } = useAuthStore()

  // 检查认证状态
  const checkAuth = useCallback(async () => {
    // 如果没有token或userInfo，且需要认证，则重定向到登录页
    if ((!token || !userInfo) && requireAuth) {
      removeToken()
      removeUserInfo()
      router.push(redirectTo)
      return
    }
  }, [token, userInfo, requireAuth, redirectTo, router, removeToken, removeUserInfo])

  // 组件挂载时检查认证状态
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const value = {
    isLoading: false,
    isAuthenticated: !!token && !!userInfo,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 创建自定义Hook用于在组件中使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用')
  }
  return context
}

// 创建高阶组件用于保护需要认证的页面
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { redirectTo?: string } = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <AuthProvider redirectTo={options.redirectTo}>
        <Component {...props} />
      </AuthProvider>
    )
  }
} 