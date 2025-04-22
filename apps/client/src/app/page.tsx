import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookmarkPlus, ListFilter, Search, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 添加一个通用的"开发中"徽章组件
function ComingSoonBadge() {
  return (
    <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
      开发中
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 导航栏 */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg 
              className="h-6 w-6 text-primary" 
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
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">BookmarketKit</span>
              <span className="text-[10px] font-medium px-1 py-0.5 rounded-sm bg-primary/15 text-primary">BETA</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="h-9 cursor-pointer">登录</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="h-9 cursor-pointer">注册</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 英雄区域 */}
        <section className="relative overflow-hidden py-20 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,white_70%,transparent)]" />
          <div className="absolute right-0 top-1/4 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 opacity-60 blur-3xl" />
          <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 opacity-60 blur-3xl" />
          
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                智能书签管理工具
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                让您的网络收藏更有序、更高效。通过AI技术，自动分类整理，让知识管理变得简单。
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="gap-2 cursor-pointer">
                    开始使用 <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="cursor-pointer">
                    了解更多
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 特性区域 */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
              核心特性
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={BookmarkPlus} 
                title="便捷收藏"
                description="一键保存您浏览的任何网页，不再有书签管理的烦恼。所有新添加的书签默认存储在收藏盒中。"
              />
              <FeatureCard 
                icon={ListFilter} 
                title="分类管理"
                description="创建、编辑、删除分类，轻松将书签移动到不同分类，通过标签系统多维度管理。"
              />
              <FeatureCard 
                icon={Search} 
                title="全局搜索"
                description="强大的搜索功能，搜索书签标题、URL、描述和标签，快速找到所需书签。"
              />
              <FeatureCard 
                icon={() => (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
                      <path d="M9 10H7V12H9V10Z" fill="currentColor" />
                      <path d="M13 10H11V12H13V10Z" fill="currentColor" />
                      <path d="M17 10H15V12H17V10Z" fill="currentColor" />
                      <path d="M21 2H3C1.89543 2 1 2.89543 1 4V16C1 17.1046 1.89543 18 3 18H11V20H7V22H17V20H13V18H21C22.1046 18 23 17.1046 23 16V4C23 2.89543 22.1046 2 21 2ZM21 16H3V4H21V16Z" fill="currentColor" />
                    </svg>
                  </div>
                )} 
                title="多设备同步"
                description="您的书签随时随地可访问，在任何设备上登录账户即可查看和管理您的收藏。"
              />
              <FeatureCard 
                icon={() => (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
                      <path d="M4 6H20V8H4V6Z" fill="currentColor" />
                      <path d="M4 11H20V13H4V11Z" fill="currentColor" />
                      <path d="M4 16H11V18H4V16Z" fill="currentColor" />
                      <path d="M19.707 14.293C19.0624 13.6479 18.0911 13.6453 17.443 14.287L15.703 16H14V20H18V18.296L19.707 16.623C20.099 16.2398 20.32 15.7129 20.3166 15.1693C20.3131 14.6257 20.0853 14.1021 19.687 13.725L19.707 13.707L19.707 14.293Z" fill="currentColor" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M2 4C2 2.89543 2.89543 2 4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4ZM4 4H20V20H4V4Z" fill="currentColor" />
                    </svg>
                  </div>
                )} 
                title="收藏盒"
                description="新添加的书签自动进入收藏盒，方便您随时查看和整理最近添加的内容。"
              />
              <FeatureCard 
                icon={() => (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor" />
                    </svg>
                  </div>
                )} 
                title="简洁界面"
                description="简约现代的界面设计，专注于用户体验，让您的书签管理更加高效。"
              />
              
              {/* 正在开发中的功能 */}
              <div className="relative">
                <ComingSoonBadge />
                <FeatureCard 
                  icon={() => (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4Z" fill="currentColor" />
                        <path d="M13 7H11V13H17V11H13V7Z" fill="currentColor" />
                      </svg>
                    </div>
                  )} 
                  title="AI智能分类"
                  description="系统智能分析书签内容并推荐分类，让您的收藏自动整理归类，省去手动分类的麻烦。"
                />
              </div>
              
              <div className="relative">
                <ComingSoonBadge />
                <FeatureCard 
                  icon={() => (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4H20V6H4V4Z" fill="currentColor" />
                        <path d="M4 8H20V10H4V8Z" fill="currentColor" />
                        <path d="M4 12H10V14H4V12Z" fill="currentColor" />
                        <path d="M14 12H20V14H14V12Z" fill="currentColor" />
                        <path d="M4 16H9V18H4V16Z" fill="currentColor" />
                        <path d="M12 16H20V18H12V16Z" fill="currentColor" />
                      </svg>
                    </div>
                  )} 
                  title="内容摘要"
                  description="AI自动生成书签页面内容的摘要，帮助您快速了解页面内容而无需打开链接。"
                />
              </div>
              
              <div className="relative">
                <ComingSoonBadge />
                <FeatureCard 
                  icon={() => (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3V21H21V3H3ZM19 19H5V5H19V19Z" fill="currentColor" />
                        <path d="M7 17H9V10H7V17Z" fill="currentColor" />
                        <path d="M11 17H13V7H11V17Z" fill="currentColor" />
                        <path d="M15 17H17V13H15V17Z" fill="currentColor" />
                      </svg>
                    </div>
                  )} 
                  title="数据统计"
                  description="查看您的书签使用情况和阅读习惯分析，帮助您更好地管理知识收藏。"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 使用流程 */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
              简单易用
            </h2>
            <div className="mx-auto max-w-3xl">
              <ol className="relative space-y-12 border-l border-primary/30 pl-8">
                <WorkflowStep 
                  number={1} 
                  title="添加书签"
                  description="输入URL或使用浏览器扩展一键保存当前页面，系统自动将书签添加到收藏盒。"
                />
                <WorkflowStep 
                  number={2} 
                  title="整理分类"
                  description="将书签整理到不同分类，添加标签，便于后续快速查找和管理。"
                />
                <WorkflowStep 
                  number={3} 
                  title="标签管理"
                  description="通过标签系统给书签添加多个标签，创建个性化的多维度分类系统。"
                />
                <WorkflowStep 
                  number={4} 
                  title="轻松搜索"
                  description="通过关键词、标签或分类快速找到您需要的书签，高效管理您的知识库。"
                />
              </ol>
            </div>
          </div>
        </section>

        {/* 开发路线图 */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-center text-3xl font-bold text-foreground md:text-4xl">
              开发路线图
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground">
              我们正在努力为您带来更多智能功能，以下是我们的开发计划
            </p>
            <div className="mx-auto max-w-4xl rounded-xl bg-primary/5 p-6 md:p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">阶段 1: 基础功能（已完成）</h3>
                    <p className="mt-1 text-muted-foreground">
                      用户注册和登录、基本书签管理、分类和标签系统、全局搜索
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">阶段 2: AI 增强（开发中）</h3>
                    <p className="mt-1 text-muted-foreground">
                      智能分类推荐、内容摘要生成、相关书签推荐
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">阶段 3: 高级功能（规划中）</h3>
                    <p className="mt-1 text-muted-foreground">
                      数据统计与分析、协作共享、浏览器扩展集成、移动应用
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 行动召唤 */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-2xl bg-primary-foreground p-8 text-center shadow-lg md:p-12">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                立即开始使用BookmarketKit
              </h2>
              <p className="mt-4 text-muted-foreground">
                免费注册账户，体验智能书签管理带来的便捷
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto cursor-pointer">
                    注册账户
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto cursor-pointer">
                    登录账户
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t py-6 md:py-8 bg-background">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <svg 
              className="h-5 w-5 text-muted-foreground" 
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
            <span className="text-sm font-medium text-muted-foreground">
              BookmarketKit © {new Date().getFullYear()}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            有问题？请联系我们：<a href="mailto:2770723534@qq.com" className="hover:underline">2770723534@qq.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 特性卡片组件
function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: LucideIcon | (() => React.ReactNode), 
  title: string, 
  description: string 
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        {typeof Icon === 'function' && !('displayName' in Icon) ? (
          // 对于自定义函数渲染器，直接调用函数
          (Icon as () => React.ReactNode)()
        ) : (
          // 对于Lucide图标或其他React组件，作为组件使用
          React.createElement(Icon as React.ComponentType<any>, {
            className: "h-6 w-6 text-primary" 
          })
        )}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

// 工作流程步骤组件
function WorkflowStep({ 
  number, 
  title, 
  description 
}: { 
  number: number, 
  title: string, 
  description: string 
}) {
  return (
    <li className="relative">
      <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </li>
  );
}
