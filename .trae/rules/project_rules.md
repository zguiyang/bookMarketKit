# 项目通用开发规范

## 架构概述

本项目采用 Monorepo 架构，统一管理前后端多个子项目和共享依赖包，实现依赖共享、版本一致和高效协作。

- **前端**：Nuxt.js 3（Vue 3）+ Nuxt UI 3
- **后端**：Fastify.js + MongoDB（mongoose）
- **包管理**：pnpm workspace
- **共享包**：TypeScript + tsup

---

## 项目结构

```
project-root/
├── apps/                  # 应用程序目录
│   ├── backend/          # 后端服务（Fastify + mongoose）
│   └── web/              # 前端应用（Nuxt 3 + Nuxt UI 3，主目录为 src）
├── packages/             # 共享依赖包
│   ├── schemas/         # 通用数据模型和类型定义
│   │   ├── src/        # 源代码
│   │   ├── dist/       # 编译输出
│   │   └── package.json # 包配置
│   ├── code-definitions/ # 错误码和消息定义
│   │   ├── src/        # 源代码
│   │   ├── dist/       # 编译输出
│   │   └── package.json # 包配置
│   └── docs/           # 项目文档
├── node_modules/
├── package.json          # 根包配置
├── pnpm-lock.yaml        # pnpm 锁文件
├── pnpm-workspace.yaml   # pnpm 工作区配置
└── README.md             # 项目总体说明
```

- 前端主业务代码必须放在 `apps/web/src` 目录下，根目录仅保留配置和依赖文件。
- 所有前端目录结构和扩展必须严格遵循 Nuxt 3 官方约定式规范，扩展自定义目录时不得与 Nuxt 3 约定目录冲突。
- 类型定义建议全部放在 `src/types/`，Nuxt 会自动合并类型声明。

### packages 目录规范

#### 1. schemas
- 存放所有应用共享的数据模型、接口类型定义
- 使用 TypeScript 严格模式
- 使用 tsup 构建，输出 ESM 格式
- 版本号遵循 Semver 规范

#### 2. code-definitions
- 存放错误码、状态码及其对应消息定义
- 支持国际化（i18n）消息定义
- 使用 TypeScript 常量枚举
- 使用 tsup 构建，输出 ESM 格式

---

## 命名规范

- **文件/目录**：kebab-case（如：user-profile/）
- **Vue/Nuxt 组件**：PascalCase（如：UserCard.vue）
- **后端类/模型**：PascalCase（如：UserModel）
- **函数/变量**：camelCase
- **常量/枚举值**：UPPER_SNAKE_CASE
- **CSS 类名**：kebab-case
- **包名**：kebab-case（如：@bookmark/schemas）
- **类型定义**：PascalCase（如：UserSchema）

---

## 版本控制规范

- **Git Commit 规范**：
  - feat: 新功能
  - fix: 修复问题
  - docs: 文档更新
  - style: 代码格式（不影响代码运行）
  - refactor: 重构
  - test: 测试相关
  - chore: 构建过程或辅助工具的变动
- **分支管理**：
  - main: 主分支，保持稳定
  - develop: 开发分支
  - feature/*: 新功能分支
  - bugfix/*: 问题修复分支
  - release/*: 发布分支

---

## 开发环境规范

- 统一使用 pnpm 作为包管理器
- Node.js >= 18.x，推荐使用 nvm 管理 Node 版本
- 编辑器建议启用保存时自动格式化，使用 Prettier、ESLint、Stylelint
- 共享包开发需要使用 TypeScript 严格模式

---

## 代码质量规范

- **TypeScript**：全项目启用严格模式，禁止 any，优先 interface
- **格式化**：Prettier
- **代码检查**：ESLint（前后端）、Stylelint（前端样式）
- **注释**：组件、函数、复杂逻辑必须有注释说明
- **API 文档**：后端接口需有 Swagger/OpenAPI 文档，前端接口类型需定义
- **共享包**：必须包含完整的类型定义和文档注释

---

## 测试规范

- **前端**：Vitest + Vue Test Utils，测试文件 *.spec.ts，覆盖率 > 80%
- **后端**：Vitest 或 Jest，测试文件 *.spec.ts，覆盖率 > 80%
- **共享包**：Vitest，需包含单元测试，覆盖率 > 90%
- **测试文件**：与源文件同目录

---

## 依赖管理与安装规范

- 统一使用 pnpm 安装依赖
- 安装新依赖：pnpm add <package-name>
- 安装开发依赖：pnpm add -D <package-name>
- 安装全局依赖：pnpm add -g <package-name>
- 工作区操作：pnpm --filter <package-name> <command>
- 更新依赖：pnpm update <package-name>
- 依赖优先在根 package.json 共享，特定依赖在各子项目 package.json
- 定期审查并更新过时依赖，关键依赖锁定精确版本
- 共享包的依赖版本必须精确指定，避免版本不一致

---

## 共享包开发规范

1. **目录结构**
   ```
   package-name/
   ├── src/          # 源代码目录
   ├── dist/         # 编译输出目录
   ├── tests/        # 测试文件目录
   ├── package.json  # 包配置文件
   ├── tsconfig.json # TypeScript 配置
   └── tsup.config.ts # 构建配置
   ```

2. **版本管理**
   - 遵循 Semver 语义化版本规范
   - 重大更新必须升级主版本号
   - 所有更新必须更新 CHANGELOG.md

3. **发布流程**
   - 完成功能开发和测试
   - 更新版本号和 CHANGELOG.md
   - 构建并检查输出文件
   - 发布到 npm 仓库

4. **文档要求**
   - README.md：包含安装、使用说明
   - API 文档：详细的接口说明
   - 更新日志：记录版本变更

---

## 其它通用要求

- 组件/逻辑应模块化、可复用，避免重复代码
- 目录结构清晰，分层合理，便于维护和扩展
- 重要变更需同步更新相关文档
- 严格遵循各自领域的详细开发规范（详见 backend.rule.mdc、frontend.rule.mdc）
- 共享包的变更需要考虑对所有使用方的影响

# 后端开发规范

## 技术栈概览

- **框架**：Fastify v5
- **数据库**：MongoDB（mongoose v8）
- **缓存**：Redis（@fastify/redis v7）
- **验证**：zod（fastify-type-provider-zod v4）/ ajv
- **API文档**：OpenAPI/Swagger（@fastify/swagger v9）
- **配置管理**：环境变量（@fastify/env v5）
- **包管理**：pnpm workspace
- **测试框架**：Vitest v3

## 目录结构规范

实际目录结构如下：

```
src/
├── app.ts                   # Fastify 应用入口
├── bootstrap.ts             # Fastify 实例初始化与配置
├── config/                  # 配置文件
├── core/                    # 核心功能（如 jwt、业务错误）
├── hooks/                   # 全局钩子
├── interfaces/              # 业务接口定义
├── middlewares/             # 中间件
├── models/                  # Mongoose 数据模型（含子目录）
├── modules/                 # 业务模块（如 user、bookmark，含子模块 category、tag）
├── plugins/                 # Fastify 插件
├── shared/                  # 共享代码（如 mongoose 通用插件）
├── typings/                 # 类型声明
├── utils/                   # 工具函数
└── tests/                   # 测试用例
```

### 业务模块结构

- 每个一级业务模块（如 user、bookmark）下可包含子模块（如 category、tag）
- 每个（子）模块均应包含 controller、route、service、schema 四类文件
- 数据模型统一放在 `models/` 下，按业务拆分子目录

---

## 命名规范（强制）

### 1. 目录与文件
- 目录、文件统一使用 kebab-case（如：bookmark-category/、bookmark.service.ts）
- 子模块文件命名格式：`<父模块>.<子模块>.<类型>.ts`，如 `bookmark.category.service.ts`
- schema 文件命名格式：`<模块>[.<子模块>].schema.ts`
- model 文件命名格式：`<模块>[.<子模块>].model.ts`
- 工具函数文件：`xxx.util.ts`，如 `query-params.util.ts`

### 2. 类、类型、接口
- 类名、类型、接口名统一使用 PascalCase（如：BookmarkService、IBookmarkDocument、UserController）
- Mongoose 文档类型：`I<模型名>Document`，Lean 类型：`I<模型名>Lean`
- Service、Controller、Model、Schema、Route 结尾均为 PascalCase

### 3. 变量、函数、方法
- 统一使用 camelCase（如：findAll、getById、userId、bookmarkList）
- 常量使用 UPPER_SNAKE_CASE（如：DATE_FORMAT）
- 枚举类型使用 PascalCase，枚举成员用 UPPER_SNAKE_CASE

### 4. 路由与 API
- 路由文件统一以 `.route.ts` 结尾
- 路由 handler 命名与 controller 方法保持一致
- 路由路径风格统一为小写、短横线分隔（如 `/page-list`、`/set-YES`）

### 5. 其他
- 插件文件统一以 `.ts` 结尾，文件名为功能名（如：auth-context.ts、db-connect.ts）
- 类型声明文件统一放在 typings/，以 `.d.ts` 结尾
- 业务接口定义文件统一放在 interfaces/，以业务为前缀

---

## 主要实现规范

### 1. Controller/Route/Service/Schema 四分层
- **Controller**：处理请求与响应，调用 service 层
- **Route**：定义路由、校验 schema、绑定 controller
- **Service**：业务逻辑实现
- **Schema**：zod/ajv 校验规则，独立文件

### 2. 插件系统
- 插件统一放在 `plugins/` 目录，按功能拆分
- 注册顺序：env → db-connect → redis → jwt → auth-context → swagger

### 3. 数据模型
- 所有 mongoose schema 放在 `models/`，按业务拆分子目录
- 统一使用 `leanTransformPlugin` 等通用插件
- 类型定义、转换逻辑抽离到 `shared/mongoose/`

### 4. 错误处理
- 业务错误统一继承 `BusinessError`
- 错误处理中间件统一在 `middlewares/` 下

### 5. 类型与接口
- 业务接口定义放在 `interfaces/`
- 全局类型声明放在 `typings/`

### 6. 工具函数
- 通用工具放在 `utils/`，如加密、参数处理等

### 7. 测试
- 测试文件与业务模块结构一致，放在 `tests/modules/模块名/`
- 覆盖 controller、route、service 层

---

## 其它补充

- 目录、文件、类、方法、常量等命名规范严格遵循 kebab-case、PascalCase、camelCase、UPPER_SNAKE_CASE
- 重要逻辑、复杂方法需有注释
- 依赖统一用 pnpm 管理
- 代码风格统一使用 Prettier、ESLint
- API 路由需配合 swagger 注释
- 认证、权限、缓存、日志、环境变量等均有独立插件和配置

---

如需更详细的代码示例或某一部分的具体规范，请告知！

## 开发规范

### 1. 模块化原则

- 每个业务模块必须包含controller、route和service三个核心文件
- 大型模块可以包含子模块（如bookmark模块包含category和tag子模块）
- 每个子模块同样遵循controller、route、service的结构
- 模块间的依赖关系应该清晰，避免循环依赖

#### 1.1 Controller职责
```typescript
// bookmark.controller.ts 示例
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const bookmark = await this.bookmarkService.create(request.body);
    return reply.code(201).send(bookmark);
  }
}
```

#### 1.2 Route职责
```typescript
// bookmark.route.ts 示例
const bookmarkRoute: FastifyPluginAsync = async (fastify) => {
  const controller = new BookmarkController(new BookmarkService());

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createBookmarkSchema,
      response: {
        201: bookmarkResponseSchema
      }
    },
    handler: controller.create.bind(controller)
  });
};
```

#### 1.3 Service职责
```typescript
// bookmark.service.ts 示例
export class BookmarkService {
  async create(data: CreateBookmarkDto): Promise<Bookmark> {
    // 业务逻辑实现
  }
}
```

### 2. 插件系统规范

#### 2.1 插件注册顺序
1. env（环境变量配置）
2. db-connect（数据库连接）
3. redis（缓存服务）
4. jwt（认证服务）
5. auth-context（认证上下文）
6. swagger（API文档）

#### 2.2 插件开发规范
```typescript
// auth-context.ts 示例
export default fp(async (fastify) => {
  fastify.decorateRequest('user', null);
  fastify.addHook('preHandler', async (request) => {
    // 插件逻辑实现
  });
}, { name: 'auth-context' });
```

### 3. 数据模型规范

#### 3.1 基础模型结构
```typescript
// bookmark.model.ts 示例
const bookmarkSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

#### 3.2 模型转换插件
```typescript
// 使用共享的转换插件
bookmarkSchema.plugin(leanTransformPlugin);
```

### 4. 错误处理规范

#### 4.1 业务错误定义
```typescript
// business-error.ts
export class BusinessError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: any
  ) {
    super(message);
  }
}
```

#### 4.2 错误处理中间件
```typescript
// error-handler.ts
export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof BusinessError) {
    return reply.status(error.code).send({
      code: error.code,
      message: error.message,
      data: error.data
    });
  }
  // 其他错误处理
};
```

### 5. 环境配置规范

#### 5.1 环境变量文件
- `.env`: 默认环境变量
- `.env.development`: 开发环境
- `.env.test`: 测试环境
- `.env.production`: 生产环境

#### 5.2 环境变量定义
```typescript
// env.ts
export const envSchema = {
  type: 'object',
  required: ['PORT', 'MONGODB_URI'],
  properties: {
    PORT: { type: 'number', default: 3000 },
    MONGODB_URI: { type: 'string' },
    REDIS_URI: { type: 'string' },
    JWT_SECRET: { type: 'string' }
  }
};
```

### 6. 测试规范

#### 6.1 测试目录结构
```
tests/
├── modules/
│   ├── user/
│   │   ├── user.controller.test.ts
│   │   ├── user.route.test.ts
│   │   └── user.service.test.ts
│   └── bookmark/
└── hello.test.ts
```

#### 6.2 测试用例规范
```typescript
// user.service.test.ts 示例
describe('UserService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      // 测试实现
    });
  });
});
```

### 7. API文档规范

#### 7.1 Swagger配置
```typescript
// swagger.ts
export default fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Bookmark API',
        description: '书签管理系统API文档',
        version: '1.0.0'
      }
    }
  });
});
```

#### 7.2 路由文档
```typescript
// 路由文档示例
fastify.route({
  method: 'POST',
  url: '/bookmarks',
  schema: {
    description: '创建新书签',
    tags: ['bookmarks'],
    body: createBookmarkSchema,
    response: {
      201: bookmarkResponseSchema
    }
  },
  handler: controller.create.bind(controller)
});
```

### 8. 安全规范

#### 8.1 认证机制
- 使用JWT进行身份验证
- 通过auth-context插件管理认证状态
- 敏感操作需要进行权限验证

#### 8.2 数据安全
- 密码必须使用bcrypt加密存储
- 敏感信息传输必须使用HTTPS
- API需要进行适当的访问控制

### 9. 性能优化规范

#### 9.1 数据库优化
- 合理使用索引
- 避免非必要的关联查询
- 大数据量查询必须使用分页

#### 9.2 缓存策略
- 合理使用Redis缓存热点数据
- 实现缓存更新和失效机制
- 避免缓存穿透和雪崩

### 10. 代码质量规范

#### 10.1 TypeScript规范
- 严格模式开启
- 避免使用any类型
- 优先使用interface定义类型

#### 10.2 命名规范
- 文件名：kebab-case
- 类名：PascalCase
- 方法名：camelCase
- 常量：UPPER_SNAKE_CASE

#### 10.3 注释规范
- 类和方法必须有JSDoc注释
- 复杂逻辑需要添加说明性注释
- 保持注释的及时更新

### 11. 日志规范

#### 11.1 日志配置
```typescript
// bootstrap.ts
const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: isDev ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    } : undefined
  }
});
```

#### 11.2 日志使用
```typescript
// 日志示例
fastify.log.info('Server started on port %d', fastify.server.address().port);
fastify.log.error('Database connection failed', err);
```

### 12. 部署规范

#### 12.1 环境要求
- Node.js >= 18.x
- MongoDB >= 6.x
- Redis >= 7.x

#### 12.2 部署流程
1. 环境变量配置
2. 依赖安装
3. 构建项目
4. 数据库迁移
5. 服务启动

### 13. 版本控制规范

#### 13.1 分支管理
- main: 主分支
- develop: 开发分支
- feature/*: 功能分支
- bugfix/*: 修复分支
- release/*: 发布分支

#### 13.2 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试相关
- chore: 构建/工具

# 前端开发规范

## 技术栈概览

- **主框架**：Nuxt.js 3（基于 Vue 3）
- **UI 组件库**：Nuxt UI 3
- **状态管理**：Pinia
- **类型系统**：TypeScript
- **样式**：原子化 CSS（如 UnoCSS/Tailwind CSS）、SCSS
- **表单校验**：zod 或 vee-validate
- **API 请求**：@nuxt/http、axios 或 useFetch
- **测试**：Vitest + Vue Test Utils
- **代码规范**：ESLint、Prettier、Stylelint

---

## UI 组件库与样式规范

### Nuxt UI 3 组件库
- 所有 Nuxt UI 3 组件均已自动注册，无需手动 import，直接在模板中使用。
- 组件名称统一以 `u-`（kebab-case）或 `U`（PascalCase）为前缀，如 `u-button` 或 `UButton`。
- 组件 props、事件、插槽等用法请参考 [Nuxt UI 官方文档](mdc:https:/ui.nuxt.com/components/button)。
- 推荐优先使用官方 UI 组件，必要时可自定义扩展。
- **如需扩展自定义组件，优先考虑使用 Reka UI + TailwindCSS 或 Nuxt UI 实现，非必要不自造轮子。如确需完全自定义组件，需先与负责人确认。**

### TailwindCSS v4
- 项目统一使用 TailwindCSS v4 作为原子化 CSS 框架。
- 页面和组件样式应尽量通过 Tailwind 的 class 实现，**避免自定义 CSS**。
- 仅在特殊场景下（如全局样式、第三方库适配）才允许自定义 CSS。
- 推荐充分利用 Tailwind 的响应式、伪类、变量等特性，提升开发效率和样式一致性。

---

## 依赖与工具（@package.json）

项目主要依赖和工具如下，需在 `apps/web/package.json` 中声明和管理：

- **核心依赖**：
  - `nuxt`：Nuxt 3 主框架
  - `vue`：Vue 3 框架
  - `vue-router`：Vue 路由（Nuxt 内部集成）
  - `typescript`：类型系统
- **UI/内容/图标**：
  - `@nuxt/ui`：官方 UI 组件库
  - `@nuxt/content`：内容管理与 Markdown 渲染
  - `@nuxt/fonts`：字体管理
  - `@nuxt/icon`：图标管理
  - `@nuxt/image`：图片优化
- **主题/色彩**：
  - `@nuxtjs/color-mode`：主题色模式切换
- **样式**：
  - `tailwindcss`：原子化 CSS 框架
  - `@tailwindcss/vite`：Tailwind Vite 插件
- **代码规范与测试**：
  - `eslint`、`@nuxt/eslint`：代码规范
  - `@nuxt/test-utils`：测试工具
- **其它**：
  - `@nuxt/http`、`axios`：API 请求（可选）

> 依赖需按需引入，版本号建议与主流社区保持同步，详见实际 package.json。

---

## 配置文件（@nuxt.config.ts）

项目主配置文件为 `apps/web/nuxt.config.ts`，主要内容包括：

- `srcDir`：主业务目录，统一为 `src/`
- `modules`：
  - `@nuxt/eslint`：集成 ESLint
  - `@nuxt/fonts`：字体管理
  - `@nuxt/ui`：UI 组件库
  - `@nuxt/icon`：图标管理
  - `@nuxtjs/color-mode`：主题色模式
  - `@nuxt/image`：图片优化
  - `@nuxt/test-utils`：测试工具
- `css`：全局样式入口（如 `~/assets/css/main.css`）
- `colorMode`：主题色配置
- `runtimeConfig`：运行时配置（如后端服务地址 `backendServerUrl`）
- `vite.plugins`：Vite 插件（如 TailwindCSS）

> 配置项需根据实际业务需求灵活调整，详见实际 nuxt.config.ts。

---

## 目录结构规范

前端代码统一放置于 `apps/web` 目录，主业务目录为 `apps/web/src`。所有目录结构必须严格遵循 Nuxt 3 官方约定式规范，扩展自定义目录时不得与 Nuxt 3 约定目录冲突。

### Nuxt 3 官方约定目录与文件（必须完整保留，未用到时也建议预留空目录/文件防止冲突）

```
apps/
└── web/
    ├── package.json
    ├── nuxt.config.ts         # Nuxt 配置文件（根目录）
    └── src/
        ├── app.vue           # 应用根组件（入口）
        ├── app.config.ts     # 应用配置（可选）
        ├── error.vue         # 全局错误页面（可选）
        ├── assets/           # 静态资源（样式、图片、字体等）
        ├── components/       # 通用组件（PascalCase 命名，自动全局注册）
        ├── composables/      # 组合式函数（useXxx 命名，自动导入）
        ├── layouts/          # 布局组件（自动注册）
        ├── middleware/       # 路由中间件（自动注册）
        ├── pages/            # 页面组件（自动路由生成，kebab-case 命名）
        ├── plugins/          # Nuxt 插件（自动注册）
        ├── public/           # 公共静态资源（对外可访问，自动映射到根路径）
        ├── server/           # 服务端 API、server middleware、server plugins 等（自动注册）
        ├── shared/           # 跨端共享代码（如 composable、类型、工具等
        ├── stores/           # Pinia 状态管理（自动注册）
        ├── utils/            # 工具函数（可扩展）
        └── ...               # 其它自定义目录（不得与上述目录重名）
```

#### 目录/文件说明：
- `app.vue`：应用根组件，所有页面的入口。
- `app.config.ts`：应用级配置（如全局 meta、head、主题等）。
- `error.vue`：全局错误页面，处理未捕获异常。
- `assets/`：静态资源目录，存放样式、图片、字体等，**不会**被自动暴露到 public 路径。
- `components/`：通用组件目录，支持自动全局注册。
- `composables/`：组合式函数目录，支持自动导入。
- `layouts/`：布局组件目录，支持自动注册。
- `middleware/`：路由中间件目录，支持自动注册。
- `pages/`：页面组件目录，自动生成路由。
- `plugins/`：Nuxt 插件目录，自动注册。
- `public/`：对外可访问的静态资源目录，自动映射到根路径。
- `server/`：服务端 API、server middleware、server plugins 等，自动注册。
- `shared/`：跨端共享代码目录（如 composable、类型、工具等，Nuxt 3.10+ 新增，推荐使用）。
- `stores/`：Pinia 状态管理目录，自动注册。
- `utils/`：工具函数目录，可扩展。
- `...`：其它自定义目录，**不得与上述 Nuxt 3 约定目录重名**。

> ⚠️ **注意：**
> - 所有主业务代码必须放在 `src` 目录下，根目录仅保留配置和依赖文件。
> - 扩展目录如 `modules/`、`services/` 等，需确保不与 Nuxt 3 约定目录重名。
> - 类型定义建议全部放在 `src/types/`，Nuxt 会自动合并类型声明。
> - 组件、页面、store、composable 必须有注释说明用途。

---

## 组件与页面规范

1. **组件命名**：
   - 组件文件使用 PascalCase（如 UserCard.vue）
   - 组合式函数 useXxx 命名（如 useUser.ts）
2. **页面命名**：
   - pages 目录下文件自动映射为路由，使用 kebab-case
3. **UI 组件**：
   - 优先使用 Nuxt UI 3 提供的组件，必要时自定义扩展
4. **Props/Emit**：
   - 明确 props 类型，事件使用 defineEmits
5. **样式**：
   - 推荐使用原子化 CSS（如 UnoCSS/Tailwind），局部样式用 <style scoped>

---

## 状态管理

- 全局状态统一使用 Pinia，store 文件放在 stores 目录
- 避免在组件间直接传递复杂数据，统一通过 store 管理

---

## API 调用与数据获取

- 推荐使用 useFetch/useAsyncData 进行服务端/客户端数据获取
- 封装 API 请求逻辑到 composables 或 api 目录
- 类型安全，接口响应定义类型

---

## 类型与工具

- 全局类型定义放在 src/types 目录，Nuxt 会自动合并类型声明
- 组件/组合式函数应有明确类型注解

---

## 代码规范

- 统一使用 ESLint + Prettier + Stylelint
- 组件、页面、store、composable 必须有注释说明用途
- 复杂逻辑需详细注释
- 命名风格：
  - 组件/类 PascalCase
  - 变量/函数 camelCase
  - 文件/目录 kebab-case

---

## 测试规范

- 单元测试用 Vitest + Vue Test Utils
- 测试文件与组件同目录，命名为 Xxx.spec.ts
- 业务代码覆盖率 > 80%

---

## 其它最佳实践

- 合理拆分组件，避免大文件
- 复用逻辑抽离为 composable
- 路由中间件统一放 middleware 目录
- 配置统一在 nuxt.config.ts
- 推荐使用 Volar/Vetur 插件进行 Vue 语法高亮和类型提示
