import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { BookmarkService } from '@/modules/bookmark/bookmark.service';
import { BookmarkCategoryService } from '@/modules/bookmark/category/bookmark.category.service';
import { BookmarkTagService } from '@/modules/bookmark/tag/bookmark.tag.service';
import { USER_ID, categories, tags, bookmarks } from './seed-data';

describe('数据写入', () => {
  let app: INestApplication;
  let bookmarkService: BookmarkService;
  let categoryService: BookmarkCategoryService;
  let tagService: BookmarkTagService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    bookmarkService = moduleFixture.get<BookmarkService>(BookmarkService);
    categoryService = moduleFixture.get<BookmarkCategoryService>(
      BookmarkCategoryService,
    );
    tagService = moduleFixture.get<BookmarkTagService>(BookmarkTagService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('应该成功写入所有测试数据', async () => {
    // 写入分类
    console.log('创建书签分类...');
    const createdCategories = await Promise.all(
      categories.map(async (category) => {
        const result = await categoryService.create({
          user_id: USER_ID,
          name: category.name,
        });
        return { name: category.name, id: result.id };
      }),
    );

    // 写入标签
    console.log('创建书签标签...');
    const createdTags = await Promise.all(
      tags.map(async (tag) => {
        const result = await tagService.create({
          user_id: USER_ID,
          name: tag.name,
        });
        return { name: tag.name, id: result.id };
      }),
    );

    // 写入书签
    console.log('创建书签...');
    for (const bookmark of bookmarks) {
      // 获取分类和标签ID
      const categoryIds = bookmark.categories
        .map((name) => createdCategories.find((c) => c.name === name)?.id)
        .filter((id): id is string => id !== undefined);

      const tagIds = bookmark.tags
        .map((name) => createdTags.find((t) => t.name === name)?.id)
        .filter((id): id is string => id !== undefined);

      // 创建书签
      await bookmarkService.create({
        user_id: USER_ID,
        url: bookmark.url,
        title: bookmark.title,
        categoryIds,
        tagIds,
        icon: bookmark.icon,
      });
    }

    console.log('测试数据写入完成！');
  }, 30000); // 设置超时时间为 30 秒
});
