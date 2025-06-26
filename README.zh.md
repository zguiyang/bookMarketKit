# Bookmark

> 🚀 一个现代化的开源智能书签管理平台，基于 Next.js & Fastify 构建。

[English version](./README.md)

---

## 产品界面预览

> 以下为主要功能界面示例

![Home Screenshot 1](https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebc.png)

![Home Screenshot 2](https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebd.png)

---

## 产品简介

Bookmark 是一个面向网页书签收藏、智能分类与内容摘要场景的全栈解决方案。平台集成了 AI 智能分类、内容摘要、标签筛选等功能，帮助用户高效管理和发现有价值的网页内容。

---

## 技术架构

- **前端**：Next.js 15、React 19、TypeScript、Tailwind CSS、React Hook Form、Zod
- **后端**：Fastify 5、TypeScript、MongoDB（mongoose）、Redis、Zod、Cheerio、OpenGraph Scraper

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

### 方式一：Docker 一键部署

最简单的部署方式是使用我们的 Docker 一键部署脚本：

1. **前提条件**

   - 系统已安装 Docker 和 Docker Compose
   - 已安装 Git 用于克隆仓库

2. **克隆仓库**

   ```bash
   git clone https://github.com/zguiyang/bookmark.git
   cd bookmark
   ```

3. **运行部署脚本**

   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **访问应用**
   - 应用：http://localhost:13092 (通过deploy.sh部署后，这是您唯一需要访问的地址)
   - API文档：http://localhost:13092/api-docs/

   > 注意：后端和前端服务无法从Docker网络外部直接访问。所有流量都通过端口13092上的Nginx代理路由。

> 部署脚本（`deploy.sh`）将自动执行以下任务：
> 
> - 检查 Docker 和 Docker Compose 依赖
> - 创建必要的配置文件（docker-compose.yaml、.env 等）
> - 为 MongoDB、Redis 和身份验证生成安全的随机密码
> - 为前端和后端服务配置环境变量
> - 构建并启动所有必需的容器
> - 将所有凭据保存到名为 `bookmark-credentials.txt` 的文件中供您参考
> 
> **重要安全提示**：`bookmark-credentials.txt` 和 `.env` 文件都包含敏感信息，包括数据库凭据和认证密钥。这些文件已自动添加到 `.gitignore` 中以防止意外提交。您应该：
>
> - 妥善备份这些文件
> - 切勿将这些文件提交到版本控制系统
> - 限制服务器上对这些文件的访问权限
> - 考虑使用密码管理器来管理生产环境的凭据
>
> 部署脚本会从根目录的模板文件（`web.env.production` 和 `backend.env.production`）复制环境配置到项目的相应位置。这些文件包含敏感信息，应妥善保管。

#### Docker 部署详情

##### 配置文件

- `docker-compose.example.yaml`：模板配置文件
- `Dockerfile`：统一的多阶段 Dockerfile，用于构建整个 Monorepo 项目
- `web.env.production`：前端环境变量模板
- `backend.env.production`：后端环境变量模板
- `apps/web/.env.production`：前端环境变量（从模板生成）
- `backend/.env.production`：后端环境变量（从模板生成）

##### 可自定义变量

以下是部署脚本中使用的变量，您可以根据需要进行自定义：

| 变量 | 默认值 | 描述 |
|----------|---------------|-------------|
| `DB_NAME` | `bookmark` | MongoDB 数据库名称 |
| `DOCKER_COMPOSE_FILE` | `docker-compose.yaml` | Docker Compose 配置文件名 |
| `DOCKER_COMPOSE_EXAMPLE` | `docker-compose.example.yaml` | 模板 Docker Compose 文件 |
| `ENV_FILE` | `.env` | 主环境变量文件 |
| `BACKEND_ENV_FILE` | `backend/.env.production` | 后端环境配置文件 |
| `FRONTEND_ENV_FILE` | `apps/web/.env.production` | 前端环境配置文件 |
| `CREDENTIALS_FILE` | `bookmark-credentials.txt` | 存储生成凭据的文件 |
| `BACKEND_PORT` | `13091` | 后端服务端口 |
| `FRONTEND_PORT` | `13090` | 前端服务端口 |
| `BETTER_AUTH_URL` | - | **必填** - 应用访问地址，用于系统的用户验证 |

**重要提示**：在部署时，请特别注意以下环境变量：
- `BETTER_AUTH_URL`：必须配置用于系统的用户验证，此地址就是应用的访问地址
- 数据库连接字符串
- JWT 密钥
- API 密钥
- OAuth 配置设置

这些变量包含敏感信息，应妥善保管。

##### Monorepo 架构与 Docker 构建

本项目使用 Monorepo 架构，并采用统一的 Docker 构建流程：

- 统一的 `Dockerfile` 在单个构建过程中处理共享包、前端和后端的构建
- 使用多阶段构建创建优化的生产镜像
- 首先构建 `packages/` 目录中的共享包，然后由前端和后端使用

##### 数据持久化

应用数据存储在 Docker 卷中：

- `mongo-data`：MongoDB 数据
- `redis-data`：Redis 数据
- `backend-uploads`：上传的文件

##### 自定义端口

您可以自定义应用程序使用的端口：

1. **在部署时使用环境变量**：
   ```bash
   # 示例：使用自定义端口
   NGINX_PORT=8080 FRONTEND_PORT=4000 BACKEND_PORT=9000 ./deploy.sh
   ```

   > 注意：部署后，您将只能通过NGINX_PORT（默认：13092）访问应用程序。
   > FRONTEND_PORT和BACKEND_PORT仅在Docker网络内部使用。

2. **手动编辑配置文件**：
   - 编辑 `deploy.sh` 中的端口值
   - 更新 `docker-compose.yaml` 中的端口映射
   - 更新根目录中的 `web.env.production` 和 `backend.env.production` 模板文件中的环境变量

##### Docker 管理命令

```bash
# 启动应用
docker-compose up -d

# 停止应用
docker-compose down

# 查看日志
docker-compose logs -f

# 重启特定服务
docker-compose restart [service_name]

# 重新构建并启动服务
docker-compose up -d --build

# 停止并删除卷（将删除所有数据！）
docker-compose down -v
```

##### 常见问题排查

- **容器无法启动**：使用 `docker-compose logs [service_name]` 检查日志
- **数据库连接问题**：验证 `.env`、`web.env.production` 和 `backend.env.production` 模板文件中的环境变量
- **端口冲突**：如果端口已被占用，更改 `docker-compose.yaml` 中的端口映射，或按上述方法使用环境变量

##### OAuth 登录配置

要启用 OAuth 登录功能，您需要配置以下环境变量：

1. **Google OAuth**：
   - `GOOGLE_CLIENT_ID`：您的 Google OAuth 客户端 ID
   - `GOOGLE_CLIENT_SECRET`：您的 Google OAuth 客户端密钥
   - `GOOGLE_CALLBACK_URL`：Google OAuth 的回调 URL（例如：`http://localhost:13091/auth/google/callback`）

2. **GitHub OAuth**：
   - `GITHUB_CLIENT_ID`：您的 GitHub OAuth 客户端 ID
   - `GITHUB_CLIENT_SECRET`：您的 GitHub OAuth 客户端密钥
   - `GITHUB_CALLBACK_URL`：GitHub OAuth 的回调 URL（例如：`http://localhost:13091/auth/github/callback`）

您可以通过在相应的开发者控制台中创建 OAuth 应用程序来获取这些凭据：
- Google：[Google Cloud Console](https://console.cloud.google.com/)
- GitHub：[GitHub Developer Settings](https://github.com/settings/developers)

### 方式二：手动开发环境设置

1. **安装依赖**

   ```bash
   pnpm install
   ```

2. **启动开发环境**

   ```bash
   # 启动前后端
   pnpm dev

   # 仅启动前端
   pnpm web:dev

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
