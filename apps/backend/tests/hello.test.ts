import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app, bootstrap } from '../src/bootstrap';

describe('Hello Route Tests', () => {
  beforeAll(async () => {
    await bootstrap(); // 初始化应用
  });

  afterAll(async () => {
    await app.close(); // 测试结束后关闭实例，释放资源
  });

  it('GET / should return 200 and correct payload', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({
      code: 0,
      message: 'success',
      data: {
        status: 'server is running!!!',
      },
    });
  });
});
