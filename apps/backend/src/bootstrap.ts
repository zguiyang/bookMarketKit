import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import cors from '@fastify/cors';
import sensiblePlugin from '@fastify/sensible';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import envPlugin from './plugins/env.js';
import DBPlugin from './plugins/db-connect.js';
import redisPlugin from './plugins/redis.js';
import jwtPlugin from './plugins/jwt.js';
import swaggerPlugin from './plugins/swagger.js';
import authContextPlugin from './plugins/auth-context.js';

import errorHandler from './middlewares/error-handler.js';
import notFoundHandler from './middlewares/not-found-handler.js';

import { onSendHookHandler } from './hooks/response-hook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envToLogger = {
  development: {
    level: 'trace',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

const NODE_ENV = process.env.NODE_ENV || 'development';

const app = Fastify({
  logger: envToLogger[NODE_ENV as keyof typeof envToLogger] ?? true,
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

    if (hostname === 'localhost' || allowedOrigins.includes(origin)) {
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
  await app.register(jwtPlugin);
  await app.register(authContextPlugin);
  await app.register(swaggerPlugin);

  // 自动加载 modules 目录下的路由
  await app.register(autoload, {
    dir: join(__dirname, 'modules'),
    matchFilter: (path) => {
      return /\.route\.(ts)$/.test(path);
    },
    dirNameRoutePrefix: true,
    logLevel: 'debug',
    options: {},
  });
}
export { bootstrap, app };
