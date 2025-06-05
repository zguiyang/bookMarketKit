import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      {' '}
      {/* 修改：简化背景色 */}
      {/* 导航栏 - 保持简化 */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
              />
            </svg>
            <span className="text-xl font-semibold text-foreground">Bookmark</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/zguiyang/bookmark" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <FaGithub className="h-5 w-5 mr-1.5" />
                GitHub
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-16 md:py-24">
        {/* 英雄区域 - 参考 linkding 风格 */}
        <section className="container max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-50">
            Bookmark
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            一款集书签保存、AI智能分类、内容摘要与多标签管理于一体的现代化开源书签管理平台。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/bookmarks">
              <Button
                size="lg"
                className="h-11 px-6 text-base rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm transition-colors gap-2 w-full sm:w-auto"
              >
                立即体验 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {/* <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-6 text-base rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium shadow-sm transition-colors w-full sm:w-auto"
              >
                了解更多
              </Button>
            </Link> */}
          </div>
        </section>

        {/* 产品截图展示区 - 居中展示 */}
        <section className="container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
          <div className="relative mx-auto w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden border border-border/50">
            <Image
              src="https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebc.png"
              alt="Bookmark 界面展示"
              width={1000}
              height={625} // 保持16:10比例
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-lg"></div>
          </div>
        </section>

        {/* 功能特性区块 - 参考 linkding 风格，简化为列表 */}
        <section id="features" className="container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-50">核心功能</h2>
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg
                    className="h-7 w-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-7-5-7 5V4z" />
                  </svg>
                ),
                title: '智能书签管理',
                description: '一键添加、编辑、删除书签，所有新书签自动进入收藏盒，管理更高效。',
              },
              {
                icon: (
                  <svg
                    className="h-7 w-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                ),
                title: 'AI智能分类与摘要',
                status: '规划中', // Add status for planning
                description: 'AI自动分析书签内容，推荐最优分类，并生成网页内容摘要，快速掌握重点信息。',
              },
              {
                icon: (
                  <svg
                    className="h-7 w-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                    <path d="M8 8h8v8H8z" />
                  </svg>
                ),
                title: '分类与标签系统',
                description: '支持自定义分类、标签，多维度组织和筛选书签，灵活高效。',
              },
              {
                icon: (
                  <svg
                    className="h-7 w-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                ),
                title: '全局搜索',
                description: '支持按标题、URL、描述、标签等多条件搜索，秒速定位所需书签。',
              },
              {
                icon: (
                  <svg
                    className="h-7 w-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 19a6 6 0 1 1 9.33-7.5A5 5 0 1 1 18 19H6z" />
                  </svg>
                ),
                title: '多设备同步',
                description: '账号登录后，书签数据自动云同步，随时随地访问和管理。',
              },
              {
                icon: (
                  <svg
                    className="h-7 w-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="14" width="7" height="7" rx="2" />
                    <rect x="3" y="14" width="7" height="7" rx="2" />
                  </svg>
                ),
                title: '简洁多视图界面',
                description: '支持列表、卡片等多种视图，界面现代简洁，体验友好。',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex flex-col items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1.5">
                  {feature.title}
                  {feature.status && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      {feature.status}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 移除背景光斑、使用场景、开发路线图、行动召唤等其他所有区域 */}
      </main>
      {/* 页脚 - 保持简化 */}
      <footer className="border-t bg-background/80">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
              />
            </svg>
            <span>Bookmark © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/zguiyang/bookmark"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub className="h-4 w-4 inline-block mr-1" />
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
