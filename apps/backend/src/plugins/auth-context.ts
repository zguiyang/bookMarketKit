import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { MOCK_USER, User } from '../interfaces/user';

export default fp(async (fastify) => {
  fastify.decorateRequest('currentUser', {
    getter() {
      // 使用私有属性 _currentUser 存储实际用户信息，默认返回 MOCK_USER
      return this._currentUser ?? { ...MOCK_USER };
    },
    setter(value: User) {
      this._currentUser = value;
    },
  });

  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    // 这里先使用 mock 数据，后续可以改为从 token 中获取
    // TODO: 实现真实的认证逻辑
    // 1. 从请求头获取 token
    // 2. 验证 token
    // 3. 获取用户信息
    request.currentUser = MOCK_USER;
  });
});
