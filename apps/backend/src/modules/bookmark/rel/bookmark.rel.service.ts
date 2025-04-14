import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbType } from '@/core/database/database-provider';
import {
  bookmarkCategoryRelationsTable,
  bookmarkTagRelationsTable,
} from '@/db/schemas';

@Injectable()
export class BookmarkRelationService {
  constructor(@Inject(DB_PROVIDER) private readonly database: DbType) {}

  /**
   * 处理书签与分类的关联关系
   * @param bookmarkId 书签ID
   * @param categoryIds 分类ID列表
   */
  async handleCategoryRelations(bookmarkId: string, categoryIds?: string[]) {
    if (!categoryIds?.length) return;

    // 删除旧的分类关联
    await this.database
      .delete(bookmarkCategoryRelationsTable)
      .where(eq(bookmarkCategoryRelationsTable.bookmark_id, bookmarkId));

    // 创建新的分类关联
    await this.database.insert(bookmarkCategoryRelationsTable).values(
      categoryIds.map((categoryId) => ({
        bookmark_id: bookmarkId,
        category_id: categoryId,
      })),
    );
  }

  /**
   * 处理书签与标签的关联关系
   * @param bookmarkId 书签ID
   * @param tagIds 标签ID列表
   */
  async handleTagRelations(bookmarkId: string, tagIds?: string[]) {
    if (!tagIds?.length) return;

    // 删除旧的标签关联
    await this.database
      .delete(bookmarkTagRelationsTable)
      .where(eq(bookmarkTagRelationsTable.bookmark_id, bookmarkId));

    // 创建新的标签关联
    await this.database.insert(bookmarkTagRelationsTable).values(
      tagIds.map((tagId) => ({
        bookmark_id: bookmarkId,
        tag_id: tagId,
      })),
    );
  }

  /**
   * 批量处理书签的分类和标签关联
   * @param bookmarkId 书签ID
   * @param categoryIds 分类ID列表
   * @param tagIds 标签ID列表
   */
  async handleRelations(
    bookmarkId: string,
    categoryIds?: string[],
    tagIds?: string[],
  ) {
    await Promise.all([
      this.handleCategoryRelations(bookmarkId, categoryIds),
      this.handleTagRelations(bookmarkId, tagIds),
    ]);
  }

  /**
   * 删除书签的所有关联关系
   * @param bookmarkId 书签ID
   */
  async removeAllRelations(bookmarkId: string) {
    await Promise.all([
      this.database
        .delete(bookmarkCategoryRelationsTable)
        .where(eq(bookmarkCategoryRelationsTable.bookmark_id, bookmarkId)),
      this.database
        .delete(bookmarkTagRelationsTable)
        .where(eq(bookmarkTagRelationsTable.bookmark_id, bookmarkId)),
    ]);
  }
}
