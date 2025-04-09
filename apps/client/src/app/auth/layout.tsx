export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* 左侧表单区域 */}
        <div className="relative flex min-h-full flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-16">
          <div className="absolute left-4 top-8 sm:left-6 lg:left-8 xl:left-16">
            <div className="flex items-center gap-2">
              <svg className="h-8 w-8 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              <span className="text-xl font-bold text-foreground">BookmarketKit</span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[480px] space-y-6">
            {children}
          </div>
        </div>

        {/* 右侧展示区域 */}
        <div className="hidden lg:block">
          <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-muted">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,white_70%,transparent)]" />
            
            {/* 动态装饰图案 */}
            <div className="absolute right-12 top-12 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 opacity-60 blur-3xl" />
            <div className="absolute -left-12 top-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 opacity-60 blur-3xl" />
            <div className="absolute bottom-24 right-12 h-56 w-56 rounded-full bg-gradient-to-bl from-primary/20 to-primary/10 opacity-60 blur-3xl" />

            {/* 主要内容 */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8 xl:px-16">
              <div className="mb-12 text-center">
                <h1 className="mb-4 bg-gradient-to-r from-foreground/90 to-foreground/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent xl:text-6xl">
                  Design with us
                </h1>
                <h2 className="text-3xl font-bold tracking-tight text-foreground/80 xl:text-4xl">
                  Explore with us
                </h2>
              </div>

              {/* 中心SVG图案 */}
              <div className="relative mx-auto mb-12 aspect-square w-full max-w-[520px] xl:max-w-[600px]">
                <div className="absolute inset-0">
                  <svg className="h-full w-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* 背景圆环 */}
                    <circle cx="200" cy="200" r="180" className="stroke-muted-foreground/20" strokeWidth="8" />
                    <circle cx="200" cy="200" r="140" className="stroke-muted-foreground/30" strokeWidth="4" />
                    
                    {/* 动态线条 */}
                    <path d="M200 20C310 20 380 90 380 200" className="stroke-primary" strokeWidth="4" strokeLinecap="round">
                      <animate attributeName="d" dur="10s" repeatCount="indefinite" values="
                        M200 20C310 20 380 90 380 200;
                        M200 20C310 50 350 120 350 200;
                        M200 20C310 20 380 90 380 200"
                      />
                    </path>
                    
                    {/* 装饰点 */}
                    <circle cx="200" cy="20" r="8" className="fill-primary" />
                    <circle cx="380" cy="200" r="8" className="fill-primary" />
                    <circle cx="200" cy="380" r="8" className="fill-primary" />
                    
                    {/* 中心图案 */}
                    <g transform="translate(140, 140)">
                      <rect width="120" height="120" rx="24" className="fill-primary/20" />
                      <rect x="20" y="20" width="80" height="80" rx="16" className="fill-primary/40" />
                      <rect x="40" y="40" width="40" height="40" rx="8" className="fill-primary" />
                    </g>
                  </svg>
                </div>
              </div>

              <p className="max-w-xl text-center text-lg text-muted-foreground xl:max-w-2xl xl:text-xl">
                智能书签管理工具，让您的网络收藏更有序、更高效。通过AI技术，自动分类整理，让知识管理变得简单。
              </p>

              {/* 底部特性列表 */}
              <div className="absolute bottom-8 left-8 right-8 xl:bottom-16 xl:left-16 xl:right-16">
                <div className="grid grid-cols-3 gap-4 rounded-2xl bg-card p-6 shadow-lg backdrop-blur-sm ring-1 ring-border xl:gap-8 xl:p-8">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-card-foreground xl:text-base">无限存储</h3>
                    <p className="text-xs text-muted-foreground xl:text-sm">Unlimited storage</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-card-foreground xl:text-base">智能分类</h3>
                    <p className="text-xs text-muted-foreground xl:text-sm">Smart categories</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-card-foreground xl:text-base">快速搜索</h3>
                    <p className="text-xs text-muted-foreground xl:text-sm">Quick search</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 



