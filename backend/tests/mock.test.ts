import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app, bootstrap } from '@/bootstrap';
import { mockBookmarks, mockCategories, mockTags } from '@/mocks/bookmark.mock';

describe('生成书签mock数据', () => {
  beforeAll(async () => {
    await bootstrap();
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
        })
      );
    }

    const results = await Promise.all(bookmarkPromises);

    expect(createdCategories.length === mockCategories.length).toBe(true);
    expect(createdTags.length === mockTags.length).toBe(true);
    expect(results.every((res) => res.statusCode === 200)).toBe(true);
  });
});
