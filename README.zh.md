# Book Market Kit

> 🚀 一个现代化的开源智能书签管理平台，基于 Next.js & NestJS 构建。

[English version](./README.md)

---

## 产品界面预览

> 以下为主要功能界面示例

![Home Screenshot 1](https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebc.png)

![Home Screenshot 2](https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebd.png)

---

## 产品简介

Book Market Kit 是一个面向网页书签收藏、智能分类与内容摘要场景的全栈解决方案。平台集成了 AI 智能分类、内容摘要、标签筛选等功能，帮助用户高效管理和发现有价值的网页内容。

---

## 技术架构

- **前端**：Next.js、React、TypeScript、Tailwind CSS、Shadcn UI、Zustand、SWR、Zod
- **后端**：NestJS、TypeScript、PostgreSQL、MongoDB、Drizzle ORM、Redis、Zod

---

## 主要功能

- **智能书签管理**：一键保存网页书签，自动归类
- **AI 智能分类**：AI 自动分析书签内容并推荐分类
- **内容摘要**：AI 自动生成网页内容摘要，提取关键信息
- **多标签系统**：支持为书签添加多个标签，便于筛选
- **全局搜索**：支持根据名称模糊搜索书签、标签、分类
- **分类管理**：自定义分类，支持新增、编辑、删除
- **响应式设计**：适配桌面与移动端，体验流畅

---

## 开发进度（TODO）

- [x] 智能书签管理
- [x] 标签系统
- [x] 响应式界面
- [x] 书签批量导入导出
- [ ] AI 智能分类
- [ ] 内容摘要

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
