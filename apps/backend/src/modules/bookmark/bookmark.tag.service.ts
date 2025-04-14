import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbType } from '@/core/database/database-provider';
import { BusinessException } from '@/common/exceptions/business.exception';
import { bookmarkTagCodeMessages } from '@/settings/code-message.setting';
import { bookmarkTagsTable } from '@/db/schemas';
import type { InsertBookmarkTag, SelectBookmarkTag } from '@/db/schemas';

@Injectable()
export class BookmarkTagService {
  constructor(@Inject(DB_PROVIDER) private readonly database: DbType) {}

  /**
   * 创建标签
   */
  async create(data: InsertBookmarkTag): Promise<SelectBookmarkTag> {
    const existingTag = await this.findByName(data.user_id, data.name);
    if (existingTag) {
      throw new BusinessException(bookmarkTagCodeMessages.existedTag);
    }

    const result = await this.database
      .insert(bookmarkTagsTable)
      .values(data)
      .returning();

    const newTag = result[0];
    if (!newTag) {
      throw new BusinessException(bookmarkTagCodeMessages.createTagError);
    }

    return newTag;
  }

  /**
   * 更新标签
   */
  async update(
    userId: string,
    id: string,
    data: Partial<InsertBookmarkTag>,
  ): Promise<SelectBookmarkTag> {
    const tag = await this.findOne(userId, id);
    if (!tag) {
      throw new BusinessException(bookmarkTagCodeMessages.notFoundTag);
    }

    // 如果要更新标签名，检查新名称是否已存在
    if (data.name && data.name !== tag.name) {
      const existingTag = await this.findByName(userId, data.name);
      if (existingTag) {
        throw new BusinessException(bookmarkTagCodeMessages.existedTag);
      }
    }

    await this.database
      .update(bookmarkTagsTable)
      .set(data)
      .where(
        and(
          eq(bookmarkTagsTable.id, id),
          eq(bookmarkTagsTable.user_id, userId),
        ),
      );

    const updatedTag = await this.findOne(userId, id);
    if (!updatedTag) {
      throw new BusinessException(bookmarkTagCodeMessages.updateTagError);
    }

    return updatedTag;
  }

  /**
   * 删除标签
   */
  async delete(userId: string, id: string): Promise<void> {
    const result = await this.database
      .delete(bookmarkTagsTable)
      .where(
        and(
          eq(bookmarkTagsTable.id, id),
          eq(bookmarkTagsTable.user_id, userId),
        ),
      );

    if (result.rowCount < 1) {
      throw new BusinessException(bookmarkTagCodeMessages.deleteTagError);
    }
  }

  /**
   * 获取用户所有标签
   */
  async findAll(userId: string): Promise<SelectBookmarkTag[]> {
    return this.database.query.bookmarkTagsTable.findMany({
      where: (tags, { eq }) => eq(tags.user_id, userId),
      orderBy: (tags, { desc }) => [desc(tags.created_at)],
    });
  }

  /**
   * 根据ID获取标签
   */
  async findOne(userId: string, id: string): Promise<SelectBookmarkTag | null> {
    return this.database.query.bookmarkTagsTable.findFirst({
      where: (tags, { eq, and }) =>
        and(eq(tags.id, id), eq(tags.user_id, userId)),
    });
  }

  /**
   * 根据名称查找标签
   */
  private async findByName(
    userId: string,
    name: string,
  ): Promise<SelectBookmarkTag | null> {
    return this.database.query.bookmarkTagsTable.findFirst({
      where: (tags, { eq, and }) =>
        and(eq(tags.name, name), eq(tags.user_id, userId)),
    });
  }
}
