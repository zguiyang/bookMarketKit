# 使用Node.js官方镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和pnpm-lock.yaml（如果存在）
COPY package*.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 设置构建时环境变量
ENV BACKEND_SERVER_URL=http://backend:3090
ENV NEXT_PUBLIC_API_URL=http://localhost:3090

# 构建应用
RUN pnpm build

# 设置运行时环境变量
ENV PORT=3091
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3091

# 启动应用
CMD ["pnpm", "start"] 