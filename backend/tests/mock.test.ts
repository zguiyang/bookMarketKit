import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app, bootstrap } from '@/bootstrap.js';
import { assign } from 'lodash-es';
import { mockBookmarks, mockCategories, mockTags } from '@/mocks/bookmark.mock.js';

describe('生成书签mock数据', () => {
  let authCookies: { [p: string]: string };
  beforeAll(async () => {
    await bootstrap();
    const loginRes = await app.inject({
      url: '/auth/sign-in/email',
      method: 'POST',
      body: {
        email: '2770723534@qq.com',
        password: 'Aa123456',
      },
    });
    // 确保登录成功
    expect(loginRes.cookies.length > 0).toBe(true);

    const { name, value, ...restCookies } = loginRes.cookies[0];
    authCookies = assign(
      {},
      {
        [name]: value,
      },
      restCookies
    );
  });

  afterAll(async () => {
    await app.close(); // 测试结束后关闭实例，释放资源
  });

  it('生成书签数据', async () => {
    const bookmarkPromises = [];
    // 生成分类数据
    const createdCategories = await Promise.all(
      mockCategories.map(async (category) => {
        const res = await app.inject({
          url: '/bookmark/category/create',
          method: 'POST',
          body: {
            name: category.name,
            icon: category.icon,
          },
          cookies: authCookies,
        });
        const newCategory = res.json().data;
        return {
          id: newCategory._id,
          name: newCategory.name,
          icon: newCategory.icon,
        };
      })
    );

    // 生成标签数据
    const createdTags = await Promise.all(
      mockTags.map(async (tag) => {
        const res = await app.inject({
          url: '/bookmark/tag/create',
          method: 'POST',
          body: {
            name: tag.name,
            color: tag.color,
          },
          cookies: authCookies,
        });
        const newTag = res.json().data;
        return {
          id: newTag._id,
          name: newTag.name,
          color: newTag.color,
        };
      })
    );

    for (const bookmark of mockBookmarks) {
      const categoryIds = createdCategories
        .filter((c) => {
          return bookmark.categories.some((c2) => c.name === c2.name);
        })
        .map((c) => c.id);

      const tagIds = createdTags
        .filter((t) => {
          return bookmark.tags?.some((t2) => t.name === t2.name);
        })
        .map((t) => t.id);

      bookmarkPromises.push(
        app.inject({
          url: '/bookmark/create',
          method: 'POST',
          body: {
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            icon: bookmark.icon,
            categoryIds: categoryIds,
            tagIds: tagIds,
          },
          cookies: authCookies,
        })
      );
    }

    const results = await Promise.all(bookmarkPromises);

    expect(createdCategories.length === mockCategories.length).toBe(true);
    expect(createdTags.length === mockTags.length).toBe(true);
    expect(results.every((res) => res.statusCode === 200)).toBe(true);
  });
});
