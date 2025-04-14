import type { InsertBookmark, SelectBookmark } from '@/db/schemas';
import { bookmarksTable } from '@/db/schemas';

import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbType } from '@/core/database/database-provider';
import { BusinessException } from '@/common/exceptions/business.exception';
import { bookmarksCodeMessages } from '@/settings/code-message.setting';
import {
  BookmarkPageListRequestDTO,
  SetFavoriteDTO,
  SetPinnedTopDTO,
  UpdateBookmarkDTO,
  CreateBookmarkDTO,
} from './dto/request.dto';
import { PageListData } from '@/dto/pagination.dto';
import { BookmarkRelationService } from './rel/bookmark.rel.service';

@Injectable()
export class BookmarkService {
  constructor(
    @Inject(DB_PROVIDER) private readonly database: DbType,
    private readonly bookmarkRelationService: BookmarkRelationService,
  ) {}

  private _processBookmarkRelations(data: any) {
    if (!data) return null;

    const { categories = [], tags = [], ...rest } = data;
    return {
      ...rest,
      categories: categories.map((item: any) => item.category),
      tags: tags.map((item: any) => item.tag),
    };
  }

  async create(
    data: InsertBookmark & Pick<CreateBookmarkDTO, 'categoryIds' | 'tagIds'>,
  ) {
    const { categoryIds, tagIds, ...bookmarkData } = data;

    const newBookmark = await this.database
      .insert(bookmarksTable)
      .values({
        user_id: bookmarkData.user_id,
        title: bookmarkData.title,
        url: bookmarkData.url,
      })
      .returning();

    if (newBookmark.length < 1) {
      throw new BusinessException(bookmarksCodeMessages.createError);
    }

    const bookmarkId = newBookmark[0].id;

    // 处理分类和标签关联
    await this.bookmarkRelationService.handleRelations(
      bookmarkId,
      categoryIds,
      tagIds,
    );

    return bookmarkId;
  }

  async update(userId: string, data: UpdateBookmarkDTO) {
    const { id, categoryIds, tagIds, ...updateData } = data;
    const bookmark = await this.findOne(userId, id);

    if (!bookmark) {
      throw new BusinessException(bookmarksCodeMessages.notFoundBookmark);
    }

    const result = await this.database
      .update(bookmarksTable)
      .set(updateData)
      .where(
        and(eq(bookmarksTable.id, id), eq(bookmarksTable.user_id, userId)),
      );

    if (result.rowCount < 1) {
      throw new BusinessException(bookmarksCodeMessages.updateError);
    }

    // 处理分类和标签关联
    await this.bookmarkRelationService.handleRelations(id, categoryIds, tagIds);
  }

  async delete(userId: string, id: string) {
    // 先删除关联关系
    await this.bookmarkRelationService.removeAllRelations(id);

    // 再删除书签
    const result = await this.database
      .delete(bookmarksTable)
      .where(
        and(eq(bookmarksTable.id, id), eq(bookmarksTable.user_id, userId)),
      );

    if (result.rowCount < 1) {
      throw new BusinessException(bookmarksCodeMessages.deleteError);
    }
  }

  async favorite(userId: string, data: SetFavoriteDTO) {
    const { id, isFavorite } = data;
    return await this.update(userId, {
      id,
      is_favorite: isFavorite,
    });
  }

  async pinnedTop(userId: string, data: SetPinnedTopDTO) {
    const { id, isPinned } = data;
    return await this.update(userId, {
      id,
      is_pinned: isPinned,
    });
  }

  async findAll(userId: string): Promise<SelectBookmark[]> {
    const bookmarks = await this.database.query.bookmarksTable.findMany({
      where: (bookmarks, { eq }) => eq(bookmarks.user_id, userId),
      orderBy: (bookmarks, { desc }) => [desc(bookmarks.created_at)],
      with: {
        categories: {
          with: {
            category: true,
          },
        },
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    return bookmarks.map((bookmark) =>
      this._processBookmarkRelations(bookmark),
    );
  }

  async findOne(userId: string, id: string): Promise<SelectBookmark> {
    const bookmark = await this.database.query.bookmarksTable.findFirst({
      where: (bookmarks, { eq, and }) =>
        and(eq(bookmarks.id, id), eq(bookmarks.user_id, userId)),
      with: {
        categories: {
          with: {
            category: true,
          },
        },
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!bookmark) {
      throw new BusinessException(bookmarksCodeMessages.notFoundBookmark);
    }

    return this._processBookmarkRelations(bookmark);
  }

  async pageList(
    userId: string,
    query: BookmarkPageListRequestDTO,
  ): Promise<PageListData<SelectBookmark>> {
    const { page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const [total, bookmarks] = await Promise.all([
      this.database
        .select({ count: sql<number>`count(*)` })
        .from(bookmarksTable)
        .where(eq(bookmarksTable.user_id, userId))
        .then((result) => Number(result[0].count)),

      this.database.query.bookmarksTable.findMany({
        where: (bookmarks, { eq }) => eq(bookmarks.user_id, userId),
        orderBy: (bookmarks, { desc }) => [desc(bookmarks.created_at)],
        limit: pageSize,
        offset,
        with: {
          categories: {
            with: {
              category: true,
            },
          },
          tags: {
            with: {
              tag: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return {
      content: bookmarks.map((bookmark) =>
        this._processBookmarkRelations(bookmark),
      ),
      pages: totalPages,
      page,
      pageSize,
      total,
    };
  }
}
