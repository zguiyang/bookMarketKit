# Book Market Kit

> 🚀 一个现代化的开源智能书签管理平台，基于 Next.js & NestJS 构建。

---

> English version: [README.md](./README.md)

---

## 产品简介

Book Market Kit 是一个面向网页书签收藏、智能分类与内容摘要场景的全栈解决方案。平台集成了 AI 智能分类、内容摘要、标签筛选等功能，帮助用户高效管理和发现有价值的网页内容。

---

## 主要功能

- **智能书签管理**：一键保存网页书签，自动归类
- **AI 智能分类**：AI 自动分析书签内容并推荐分类
- **内容摘要**：AI 自动生成网页内容摘要，提取关键信息
- **多标签系统**：支持为书签添加多个标签，便于筛选
- **全局搜索**：支持按标题、URL、描述、标签等多维度搜索
- **分类管理**：自定义分类，支持拖拽、编辑、删除
- **响应式设计**：适配桌面与移动端，体验流畅

---

## 开发进度（TODO）

- [x] 智能书签管理
- [x] AI 智能分类（beta）
- [x] 内容摘要（beta）
- [x] 标签系统
- [x] 响应式界面
- [ ] 用户资料与认证
- [ ] 书签批量导入导出
- [ ] 通知系统
- [ ] 管理后台
- [ ] 产品界面截图替换占位图

---

## 产品界面预览

> 以下为主要功能界面示例（占位图，实际请替换为产品截图）

### 书签首页与浏览

![首页界面](https://via.placeholder.com/900x500?text=首页界面占位图)

### 智能书签与AI摘要

![AI摘要界面](https://via.placeholder.com/900x500?text=AI摘要界面占位图)

### 分类与标签管理

![分类管理界面](https://via.placeholder.com/900x500?text=分类管理界面占位图)

---

## 技术架构

- **前端**：Next.js、React、TypeScript、Tailwind CSS、Shadcn UI、Zustand、SWR、Zod
- **后端**：NestJS、TypeScript、PostgreSQL、MongoDB、Drizzle ORM、Redis、Zod

---

## 快速开始

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **启动开发环境**
   ```bash
   # 启动前后端
   pnpm dev

   # 仅启动前端
   pnpm client:dev

   # 仅启动后端
   pnpm backend:dev
   ```

3. **构建与生产部署**
   ```bash
   pnpm build
   pnpm start
   ```

---

## 贡献指南

欢迎社区贡献代码、文档与建议！请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献流程。

---

## 许可证

[ISC](./LICENSE) 