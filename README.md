# Book Market Kit

图书交易平台是一个基于 Next.js 和 NestJS 的全栈应用，提供图书交易和管理功能。

## 技术栈

### 前端
- Next.js (React 框架)
- TypeScript
- Tailwind CSS
- Shadcn UI 和 Radix UI
- Zustand (状态管理)
- SWR (数据获取)
- Zod (数据验证)

### 后端
- NestJS
- TypeScript
- PostgreSQL
- MongoDB
- Drizzle ORM
- Redis
- Zod

## 开发环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL
- MongoDB
- Redis

## 项目结构

```
root/
├── apps/
│   ├── client/     # 前端应用
│   └── backend/    # 后端服务
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## 开始使用

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发服务器：
```bash
# 同时启动前端和后端
pnpm dev

# 仅启动前端
pnpm client:dev

# 仅启动后端
pnpm backend:dev
```

3. 构建项目：
```bash
pnpm build
```

4. 启动生产环境：
```bash
pnpm start
```

## 开发指南

- 使用 TypeScript 进行开发
- 遵循项目的代码规范和最佳实践
- 提交代码前运行测试和代码格式化：
  ```bash
  pnpm test
  pnpm format
  ```

## 许可证

ISC
