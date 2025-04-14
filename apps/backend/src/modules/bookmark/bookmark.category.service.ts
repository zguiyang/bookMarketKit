import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbType } from '@/core/database/database-provider';
import { BusinessException } from '@/common/exceptions/business.exception';
import { bookmarkCategoryCodeMessages } from '@/settings/code-message.setting';
import { bookmarkCategoriesTable } from '@/db/schemas';
import type {
  InsertBookmarkCategory,
  SelectBookmarkCategory,
} from '@/db/schemas';

@Injectable()
export class BookmarkCategoryService {
  constructor(@Inject(DB_PROVIDER) private readonly database: DbType) {}

  /**
   * 创建分类
   */
  async create(data: InsertBookmarkCategory): Promise<SelectBookmarkCategory> {
    const existingCategory = await this.findByName(data.user_id, data.name);
    if (existingCategory) {
      throw new BusinessException(bookmarkCategoryCodeMessages.existedCategory);
    }

    const result = await this.database
      .insert(bookmarkCategoriesTable)
      .values(data)
      .returning();

    const newCategory = result[0];
    if (!newCategory) {
      throw new BusinessException(
        bookmarkCategoryCodeMessages.createCategoryError,
      );
    }

    return newCategory;
  }

  /**
   * 更新分类
   */
  async update(
    userId: string,
    id: string,
    data: Partial<InsertBookmarkCategory>,
  ): Promise<SelectBookmarkCategory> {
    const category = await this.findOne(userId, id);
    if (!category) {
      throw new BusinessException(
        bookmarkCategoryCodeMessages.notFoundCategory,
      );
    }

    // 如果要更新分类名，检查新名称是否已存在
    if (data.name && data.name !== category.name) {
      const existingCategory = await this.findByName(userId, data.name);
      if (existingCategory) {
        throw new BusinessException(
          bookmarkCategoryCodeMessages.existedCategory,
        );
      }
    }

    await this.database
      .update(bookmarkCategoriesTable)
      .set(data)
      .where(
        and(
          eq(bookmarkCategoriesTable.id, id),
          eq(bookmarkCategoriesTable.user_id, userId),
        ),
      );

    const updatedCategory = await this.findOne(userId, id);
    if (!updatedCategory) {
      throw new BusinessException(
        bookmarkCategoryCodeMessages.updateCategoryError,
      );
    }

    return updatedCategory;
  }

  /**
   * 删除分类
   */
  async delete(userId: string, id: string): Promise<void> {
    const result = await this.database
      .delete(bookmarkCategoriesTable)
      .where(
        and(
          eq(bookmarkCategoriesTable.id, id),
          eq(bookmarkCategoriesTable.user_id, userId),
        ),
      );

    if (result.rowCount < 1) {
      throw new BusinessException(
        bookmarkCategoryCodeMessages.deleteCategoryError,
      );
    }
  }

  /**
   * 获取用户所有分类
   */
  async findAll(userId: string): Promise<SelectBookmarkCategory[]> {
    return this.database.query.bookmarkCategoriesTable.findMany({
      where: (categories, { eq }) => eq(categories.user_id, userId),
      orderBy: (categories, { desc }) => [desc(categories.created_at)],
    });
  }

  /**
   * 根据ID获取分类
   */
  async findOne(
    userId: string,
    id: string,
  ): Promise<SelectBookmarkCategory | null> {
    return this.database.query.bookmarkCategoriesTable.findFirst({
      where: (categories, { eq, and }) =>
        and(eq(categories.id, id), eq(categories.user_id, userId)),
    });
  }

  /**
   * 根据名称查找分类
   */
  private async findByName(
    userId: string,
    name: string,
  ): Promise<SelectBookmarkCategory | null> {
    return this.database.query.bookmarkCategoriesTable.findFirst({
      where: (categories, { eq, and }) =>
        and(eq(categories.name, name), eq(categories.user_id, userId)),
    });
  }
}
