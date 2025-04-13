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
} from './dto/request.dto';
import { PageListData } from '@/dto/pagination.dto';

@Injectable()
export class BookmarkService {
  constructor(@Inject(DB_PROVIDER) private readonly database: DbType) {}

  async create(data: InsertBookmark) {
    const newBookmark = await this.database.insert(bookmarksTable).values({
      user_id: data.user_id,
      title: data.title,
      url: data.url,
    });

    if (newBookmark.rowCount < 1) {
      throw new BusinessException(bookmarksCodeMessages.createError);
    }
  }

  async update(userId: string, data: UpdateBookmarkDTO) {
    const { id, ...updateData } = data;
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
  }

  async delete(userId: string, id: string) {
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
    return this.database.query.bookmarksTable.findMany({
      where: (bookmarks, { eq }) => eq(bookmarks.user_id, userId),
      orderBy: (bookmarks, { desc }) => [desc(bookmarks.created_at)],
    });
  }

  async findOne(userId: string, id: string): Promise<SelectBookmark> {
    const bookmark = await this.database.query.bookmarksTable.findFirst({
      where: (bookmarks, { eq, and }) =>
        and(eq(bookmarks.id, id), eq(bookmarks.user_id, userId)),
    });

    if (!bookmark) {
      throw new BusinessException(bookmarksCodeMessages.notFoundBookmark);
    }
    return bookmark;
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
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return {
      content: bookmarks,
      pages: totalPages,
      page,
      pageSize,
      total,
    };
  }
}
