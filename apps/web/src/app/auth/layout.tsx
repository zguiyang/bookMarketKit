export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      {/* 产品标识 */}
      <header className="flex-none w-full flex-shrink-0 border-b border-border/40">
        <div className="w-full px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-4">
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
            <span className="text-base sm:text-lg font-medium text-foreground/90">
              BookmarketKit
              <span className="ml-1.5 text-[10px] font-medium px-1 py-0.5 rounded-sm bg-primary/15 text-primary align-text-top">BETA</span>
            </span>
          </div>
        </div>
      </header>

      {/* 主要内容区域 - 独立滚动 */}
      <main className="flex-auto w-full overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6 sm:py-8 md:py-10">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="mx-auto w-full max-w-[380px] sm:max-w-[420px] space-y-6">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* 底部装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[40%] top-0 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/5 to-primary/30 opacity-20 blur-3xl" />
      </div>
    </div>
  )
} 



