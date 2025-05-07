import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app, bootstrap } from '../src/bootstrap';
import mockBookmarks from '@/mocks/bookmark.mock';

describe('生成书签mock数据', () => {
  beforeAll(async () => {
    await bootstrap();
  });

  afterAll(async () => {
    await app.close(); // 测试结束后关闭实例，释放资源
  });

  it('生成书签数据', async () => {
    const bookmarkPromise = [];
    const categoryPromises = [];
    const tagPromises = [];
    for (const bookmark of mockBookmarks) {
      const { categories, tags } = bookmark;

      // 生成分类
      for (const category of categories) {
        categoryPromises.push(
          app.inject({
            url: '/bookmark/category/create',
            method: 'POST',
            body: {
              name: category.name,
              icon: category.icon,
            },
          })
        );
      }

      // 生成标签
      for (const tag of tags) {
        tagPromises.push(
          app.inject({
            url: '/bookmark/tag/create',
            method: 'POST',
            body: {
              name: tag.name,
              color: tag.color,
            },
          })
        );
      }

      const [categoryResponses, tagResponses] = await Promise.all([
        Promise.all(categoryPromises),
        Promise.all(tagPromises),
      ]);
      const categoryIds = categoryResponses.map((res) => res.json().data._id);
      console.log('🚀 ~  ~ categoryIds: ', categoryIds);
      const tagIds = tagResponses.map((res) => res.json().data._id);
      console.log('🚀 ~  ~ tagIds: ', tagIds);

      bookmarkPromise.push(
        app.inject({
          url: '/bookmark/create',
          method: 'POST',
          body: {
            title: bookmark.title,
            url: bookmark.url,
            icon: bookmark.icon,
            description: bookmark.description,
            categoryIds,
            tagIds,
          },
        })
      );
    }
    const bookmarkResponses = await Promise.all(bookmarkPromise);
    expect(bookmarkResponses.every((res) => res.statusCode === 200)).toBe(true);
  });
});
