# 构建阶段
FROM node:18 AS builder

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm@9.12.3

# 复制package.json文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY backend/package.json ./backend/
COPY packages/auth/package.json ./packages/auth/
COPY packages/code-definitions/package.json ./packages/code-definitions/
COPY packages/schemas/package.json ./packages/schemas/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建共享包
RUN pnpm build:packages

# 构建后端
RUN pnpm --filter backend build

# 构建前端
RUN pnpm --filter web build

# 前端生产阶段
FROM node:18-alpine AS web

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 从构建阶段复制必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/next.config.ts ./apps/web/

# 设置缓存目录权限
RUN mkdir -p /app/apps/web/.next/cache
RUN chown -R nextjs:nodejs /app/apps/web/.next/cache

# 切换到非root用户
USER nextjs

WORKDIR /app/apps/web

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

# 启动Next.js应用
CMD ["node_modules/.bin/next", "start"]

# 后端生产阶段
FROM node:18-alpine AS backend

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fastify -u 1001

# 设置工作目录
WORKDIR /app

# 从构建阶段复制必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist

# 复制共享包
COPY --from=builder /app/packages ./packages

# 创建上传目录并设置权限
RUN mkdir -p /app/backend/uploads \
    && chown -R fastify:nodejs /app/backend/uploads

# 切换到非root用户
USER fastify

WORKDIR /app/backend

EXPOSE 8000

ENV PORT 8000
ENV NODE_ENV production

# 启动后端服务
CMD ["node", "dist/app.js"]