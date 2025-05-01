# apps-new/backend

本目录为重构后的后端服务，基于 Fastify.js + MongoDB（mongoose）技术栈。

## 技术栈
- Fastify.js
- MongoDB
- mongoose
- Redis
- JWT（fastify-jwt）
- zod/ajv 校验
- OpenAPI/Swagger（fastify-swagger）

## 目录结构

```
src/
├── plugins/         # Fastify 插件（如数据库、redis、jwt等）
├── models/          # mongoose 数据模型
├── routes/          # 路由定义
├── controllers/     # 控制器/处理器
├── services/        # 业务逻辑
├── schemas/         # 请求/响应校验（zod/ajv）
├── utils/           # 工具函数
├── middlewares/     # 中间件
├── types/           # 全局类型定义
├── config/          # 配置文件
├── app.ts           # Fastify 实例与主入口
└── main.ts          # 启动脚本
```

详细开发规范请参考 [backend.rule.mdc](../../.cursor/rules/backend.rule.mdc)
