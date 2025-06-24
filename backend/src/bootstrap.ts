import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import cors from '@fastify/cors';
import sensiblePlugin from '@fastify/sensible';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import envPlugin from './plugins/env.js';
import DBPlugin from './plugins/db.js';
import redisPlugin from './plugins/redis.js';
import swaggerPlugin from './plugins/swagger.js';
import authPlugin from './plugins/auth.js';
import multipartPlugin from './plugins/multipart.js';
import workerPlugin from './plugins/worker.js';

import errorHandler from './middlewares/error-handler.js';
import notFoundHandler from './middlewares/not-found-handler.js';

import { onSendHookHandler } from './hooks/response-hook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      coerceTypes: false, // 禁用ajv的类型转换, 使用zod的类型转换
    },
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.withTypeProvider<ZodTypeProvider>();

app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) {
      cb(null, true);
      return;
    }
    const hostname = new URL(origin).hostname;
    const allowedOrigins = ['https://bookmark.9crd.com'];

    // 允许所有本地IP地址（localhost、127.0.0.1）
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      cb(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      cb(null, true);
      return;
    }

    // 拒绝其他来源
    cb(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
});

async function bootstrap() {
  // 注册全局响应钩子
  app.addHook('onSend', onSendHookHandler);
  //
  // 注册全局404处理器
  app.setNotFoundHandler(notFoundHandler);

  // 注册全局错误处理器
  app.setErrorHandler(errorHandler);

  await app.register(sensiblePlugin);

  // sign-up project plugins
  await app.register(envPlugin); // must be registered first
  await app.register(DBPlugin);
  await app.register(redisPlugin);
  await app.register(authPlugin);
  await app.register(swaggerPlugin);
  await app.register(multipartPlugin);
  await app.register(workerPlugin);

  // autoload services
  await app.register(autoload, {
    dir: join(__dirname, 'services'),
    matchFilter: (path) => {
      return /\.route\.(js|ts)$/.test(path);
    },
    dirNameRoutePrefix: true,
    logLevel: 'trace',
    options: {},
  });
  console.log('loaded routes=>', app.printRoutes());
}

export { bootstrap, app };
