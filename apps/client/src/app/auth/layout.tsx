export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center py-6 sm:py-8 md:py-12">
      {/* 产品标识 */}
      <div className="absolute left-4 sm:left-6 md:left-8 lg:left-12 top-6 sm:top-8 md:top-12">
        <div className="flex items-center gap-2.5">
          <svg 
            className="h-5 w-5 sm:h-6 sm:w-6 text-primary" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" 
            />
          </svg>
          <span className="text-base sm:text-lg font-medium text-foreground/90">BookmarketKit</span>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-[380px] sm:max-w-[420px] space-y-6">
          {children}
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[40%] top-0 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/5 to-primary/30 opacity-20 blur-3xl" />
      </div>
    </div>
  )
} 



