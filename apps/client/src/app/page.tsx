import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              <Button variant="outline" className="h-10 px-6 text-base rounded-lg border-2 border-primary text-primary font-bold transition-all duration-200 hover:bg-primary/10 hover:text-primary-700 shadow-none cursor-pointer">
                登录
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="h-10 px-6 text-base rounded-lg bg-gradient-to-r from-primary via-blue-500 to-pink-500 text-white font-bold shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                注册
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-x-hidden">
        {/* 背景渐变与光斑装饰 */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* 顶部大渐变 */}
          <div className="absolute left-1/2 top-0 h-[480px] w-[120vw] -translate-x-1/2 bg-gradient-to-br from-primary/10 via-blue-200/30 to-pink-100/30 blur-2xl opacity-80" />
          {/* 彩色光斑 */}
          <div className="absolute left-[10%] top-24 h-60 w-60 rounded-full bg-gradient-to-br from-blue-300/40 to-purple-200/30 blur-3xl opacity-60" />
          <div className="absolute right-[8%] top-40 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-200/40 to-yellow-100/30 blur-3xl opacity-60" />
          <div className="absolute left-1/2 bottom-0 h-80 w-[60vw] -translate-x-1/2 bg-gradient-to-t from-primary/10 via-white/0 to-transparent blur-2xl opacity-70" />
        </div>
        {/* 英雄区域 */}
        <section className="relative z-10 overflow-visible py-20 md:py-28 lg:py-36 flex flex-col items-center justify-center">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              代码构建
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mx-1">想象</span>
              <br className="hidden sm:block" />
              设计驱动
              <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-orange-400 bg-clip-text text-transparent mx-1">未来</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground font-light">
              欢迎使用 BookmarketKit，一站式智能书签管理工具，AI赋能，极致Web体验与高效知识管理。
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="h-10 px-8 text-base rounded-lg bg-gradient-to-r from-primary via-blue-500 to-pink-500 text-white font-bold shadow-md transition-all duration-200 hover:scale-105 gap-2 cursor-pointer">
                  开始使用 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-10 px-8 text-base rounded-lg border-2 border-primary text-primary font-bold transition-all duration-200 hover:bg-primary/10 hover:text-primary-700 cursor-pointer">
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 功能特性区块 */}
        <section id="features" className="py-20 md:py-28 bg-background/80 relative z-10">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-14 text-center text-3xl font-extrabold text-foreground md:text-4xl tracking-tight">
              功能特性
            </h2>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {/* 1. 智能书签管理 */}
              <div className="relative group rounded-2xl border border-primary/10 bg-white/70 dark:bg-card/80 p-8 shadow-xl flex flex-col min-h-[220px] transition-all duration-200 hover:shadow-2xl hover:border-2 hover:border-sky-400/70">
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 shadow-sm">开发中</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-400 mb-4 shadow-md">
                  {/* 书签图标 */}
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-7-5-7 5V4z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">智能书签管理</h3>
                <p className="text-base text-muted-foreground font-light mb-4">一键添加、编辑、删除书签，所有新书签自动进入收藏盒，管理更高效。</p>
                <div className="flex gap-2 mt-auto">
                  <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-medium">书签</span>
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium">编辑</span>
                </div>
              </div>
              {/* 2. AI智能分类与摘要 */}
              <div className="relative group rounded-2xl border border-primary/10 bg-white/70 dark:bg-card/80 p-8 shadow-xl flex flex-col min-h-[220px] transition-all duration-200 hover:shadow-2xl hover:border-2 hover:border-fuchsia-400/70">
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 shadow-sm">开发中</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 via-purple-400 to-purple-500 mb-4 shadow-md">
                  {/* AI图标 */}
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">AI智能分类与摘要</h3>
                <p className="text-base text-muted-foreground font-light mb-4">AI自动分析书签内容，推荐最优分类，并生成网页内容摘要，快速掌握重点信息。</p>
                <div className="flex gap-2 mt-auto">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">AI分类</span>
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">内容摘要</span>
                </div>
              </div>
              {/* 3. 分类与标签系统 */}
              <div className="relative group rounded-2xl border border-primary/10 bg-white/70 dark:bg-card/80 p-8 shadow-xl flex flex-col min-h-[220px] transition-all duration-200 hover:shadow-2xl hover:border-2 hover:border-green-400/70">
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 shadow-sm">开发中</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 via-emerald-400 to-lime-300 mb-4 shadow-md">
                  {/* 分类标签图标 */}
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 8h8v8H8z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">分类与标签系统</h3>
                <p className="text-base text-muted-foreground font-light mb-4">支持自定义分类、标签，多维度组织和筛选书签，灵活高效。</p>
                <div className="flex gap-2 mt-auto">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">分类</span>
                  <span className="px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-xs font-medium">标签</span>
                </div>
              </div>
              {/* 4. 全局搜索 */}
              <div className="relative group rounded-2xl border border-primary/10 bg-white/70 dark:bg-card/80 p-8 shadow-xl flex flex-col min-h-[220px] transition-all duration-200 hover:shadow-2xl hover:border-2 hover:border-blue-400/70">
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 shadow-sm">开发中</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-300 mb-4 shadow-md">
                  {/* 搜索图标 */}
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">全局搜索</h3>
                <p className="text-base text-muted-foreground font-light mb-4">支持按标题、URL、描述、标签等多条件搜索，秒速定位所需书签。</p>
                <div className="flex gap-2 mt-auto">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">搜索</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-medium">多条件</span>
                </div>
              </div>
              {/* 5. 多设备同步 */}
              <div className="relative group rounded-2xl border border-primary/10 bg-white/70 dark:bg-card/80 p-8 shadow-xl flex flex-col min-h-[220px] transition-all duration-200 hover:shadow-2xl hover:border-2 hover:border-orange-400/70">
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 shadow-sm">开发中</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 via-yellow-400 to-pink-300 mb-4 shadow-md">
                  {/* 云同步图标 */}
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 19a6 6 0 1 1 9.33-7.5A5 5 0 1 1 18 19H6z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">多设备同步</h3>
                <p className="text-base text-muted-foreground font-light mb-4">账号登录后，书签数据自动云同步，随时随地访问和管理。</p>
                <div className="flex gap-2 mt-auto">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">同步</span>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">多端</span>
                </div>
              </div>
              {/* 6. 简洁多视图界面 */}
              <div className="relative group rounded-2xl border border-primary/10 bg-white/70 dark:bg-card/80 p-8 shadow-xl flex flex-col min-h-[220px] transition-all duration-200 hover:shadow-2xl hover:border-2 hover:border-pink-400/70">
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 shadow-sm">开发中</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-400 mb-4 shadow-md">
                  {/* 多视图图标 */}
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">简洁多视图界面</h3>
                <p className="text-base text-muted-foreground font-light mb-4">支持列表、卡片等多种视图，界面现代简洁，体验友好。</p>
                <div className="flex gap-2 mt-auto">
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">多视图</span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">简洁</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 开发路线图 - 极简时间轴风格 */}
        <section className="py-24 bg-primary/5">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-pink-500 bg-clip-text text-transparent md:text-4xl">
              开发路线图
            </h2>
            <div className="relative pl-8">
              {/* 渐变竖线 */}
              <div className="absolute left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-primary via-blue-400 to-pink-400 opacity-30" />
              <ul className="space-y-20">
                {/* 阶段1 */}
                <li className="flex items-start gap-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-green-300 to-green-500 shadow-lg">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">阶段 1: 基础功能（已完成）</h3>
                    <p className="text-muted-foreground text-base font-light">用户注册和登录、基本书签管理、分类和标签系统、全局搜索</p>
                  </div>
                </li>
                {/* 阶段2 */}
                <li className="flex items-start gap-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-300 to-pink-400 shadow-lg">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">阶段 2: AI 增强（开发中）</h3>
                    <p className="text-muted-foreground text-base font-light">智能分类推荐、内容摘要生成、相关书签推荐</p>
                  </div>
                </li>
                {/* 阶段3 */}
                <li className="flex items-start gap-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-sky-400 to-purple-400 shadow-lg">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">阶段 3: 高级功能（规划中）</h3>
                    <p className="text-muted-foreground text-base font-light">数据统计与分析、协作共享、浏览器扩展集成、移动应用</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 行动召唤 - 极简开放风格 */}
        <section className="py-24 bg-transparent relative">
          {/* 渐变光斑点缀 */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[60vw] h-40 bg-gradient-to-r from-primary/20 via-blue-200/20 to-pink-100/20 blur-2xl opacity-60" />
          <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-blue-500 to-pink-500 bg-clip-text text-transparent mb-6 text-center">
              立即开始使用BookmarketKit
            </h2>
            <p className="mt-2 text-muted-foreground text-lg mb-10 text-center">
              免费注册账户，体验智能书签管理带来的便捷
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="h-10 px-8 text-base rounded-lg bg-gradient-to-r from-primary via-blue-500 to-pink-500 text-white font-bold shadow-md transition-all duration-200 hover:scale-105 w-full sm:w-auto cursor-pointer">
                  注册账户
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="h-10 px-8 text-base rounded-lg border-2 border-primary text-primary font-bold transition-all duration-200 hover:bg-primary/10 hover:text-primary-700 w-full sm:w-auto cursor-pointer">
                  登录账户
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t py-8 md:py-10 bg-background/90">
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
