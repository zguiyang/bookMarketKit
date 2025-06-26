# Build stage
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.12.3

# Configure npm and pnpm with official registry
# Using official registry as the server is located outside mainland China
RUN npm config set registry https://registry.npmjs.org/
RUN pnpm config set registry https://registry.npmjs.org/
RUN pnpm config set network-timeout 300000

# Copy package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY backend/package.json ./backend/
COPY packages/auth/package.json ./packages/auth/
COPY packages/code-definitions/package.json ./packages/code-definitions/
COPY packages/schemas/package.json ./packages/schemas/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build shared packages
RUN pnpm build:packages

# Build backend
RUN pnpm --filter backend build

# Build frontend
RUN pnpm --filter web build

# Frontend production stage
FROM node:18-alpine AS web

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/next.config.ts ./apps/web/

# Set cache directory permissions
RUN mkdir -p /app/apps/web/.next/cache
RUN chown -R nextjs:nodejs /app/apps/web/.next/cache

# Switch to non-root user
USER nextjs

WORKDIR /app/apps/web

# Use ARG to receive port variable passed during build, default value consistent with deploy.sh
ARG FRONTEND_PORT=13090
EXPOSE ${FRONTEND_PORT}

ENV PORT ${FRONTEND_PORT}
ENV NODE_ENV production

# Start Next.js application
CMD ["node_modules/.bin/next", "start"]

# Backend production stage
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

# Copy shared packages
COPY --from=builder /app/packages ./packages

# Create upload directory and set permissions
RUN mkdir -p /app/backend/uploads /app/backend/static \
    && chown -R fastify:nodejs /app/backend/uploads /app/backend/static

# 切换到非root用户
USER fastify

WORKDIR /app/backend

# 使用ARG接收构建时传入的端口变量，默认值与deploy.sh中保持一致
ARG BACKEND_PORT=13091
EXPOSE ${BACKEND_PORT}

ENV PORT ${BACKEND_PORT}
ENV NODE_ENV production

# Start backend service
CMD ["node", "dist/app.js"]