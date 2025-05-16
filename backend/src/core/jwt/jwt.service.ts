import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

/**
 * JWT 核心服务
 * 处理 token 的生成、验证等基础功能
 */
export class JwtService {
  constructor(private readonly fastify: FastifyInstance) {}

  /**
   * 生成 token
   * @param payload 需要加密的数据
   */
  generateToken(payload: Record<string, any>): string {
    return this.fastify.jwt.sign(payload);
  }

  /**
   * 验证 token
   * @param token JWT token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return await this.fastify.jwt.verify(token);
    } catch (err) {
      this.fastify.log.error('JWT 验证失败:', err);
      return null;
    }
  }

  /**
   * 验证请求中的 token
   * @param request Fastify 请求对象
   * @param reply Fastify 响应对象
   */
  async authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await request.jwtVerify();
    } catch (err) {
      this.fastify.log.error('JWT 验证失败:', err);
      reply.code(401).send({
        code: 401,
        message: '未授权或 token 已过期',
        data: null,
      });
    }
  }
}
