import { Injectable } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { DatabaseService } from '@/core/database/database.service';
import { ResponseService } from '@/core/response/response.service';
import { bookmarksCodeMessages } from '@/settings/code-message.setting';
import { bookmarksTable } from '@/db/schemas';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './dto/request.dto';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly responseService: ResponseService,
  ) {}

  async create(userId: string, data: CreateBookmarkDTO) {
    const newBookmark = await this.databaseService.db
      .insert(bookmarksTable)
      .values({
        user_id: userId,
        title: data.title,
        url: data.url,
      });

    if (newBookmark.rowCount > 0) {
      return this.responseService.success<null>({});
    }
    return this.responseService.error(bookmarksCodeMessages.createError);
  }

  async update(userId: string, data: UpdateBookmarkDTO) {
    const { id, ...updateData } = data;
    // 检查书签是否存在且属于当前用户
    const bookmark = await this.findOne(userId, id);

    if (!bookmark) {
      return this.responseService.error(bookmarksCodeMessages.notFoundBookmark);
    }

    const result = await this.databaseService.db
      .update(bookmarksTable)
      .set(updateData)
      .where(
        and(eq(bookmarksTable.id, id), eq(bookmarksTable.user_id, userId)),
      );

    if (result.rowCount > 0) {
      return this.responseService.success<null>({});
    }
    return this.responseService.error(bookmarksCodeMessages.updateError);
  }

  async delete(userId: string, id: string) {
    const result = await this.databaseService.db
      .delete(bookmarksTable)
      .where(
        and(eq(bookmarksTable.id, id), eq(bookmarksTable.user_id, userId)),
      );

    if (result.rowCount > 0) {
      return this.responseService.success<null>({});
    }
    return this.responseService.error(bookmarksCodeMessages.deleteError);
  }

  async findAll(userId: string) {
    const bookmarks =
      await this.databaseService.db.query.bookmarksTable.findMany({
        where: (bookmarks, { eq }) => eq(bookmarks.user_id, userId),
        orderBy: (bookmarks, { desc }) => [desc(bookmarks.created_at)],
      });

    return this.responseService.success({ data: bookmarks });
  }

  async findOne(userId: string, id: string) {
    const bookmark =
      await this.databaseService.db.query.bookmarksTable.findFirst({
        where: (bookmarks, { eq, and }) =>
          and(eq(bookmarks.id, id), eq(bookmarks.user_id, userId)),
      });

    if (!bookmark) {
      return this.responseService.error(bookmarksCodeMessages.notFoundBookmark);
    }
    return this.responseService.success({ data: bookmark });
  }

  async pageList(userId: string, page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;

    const [total, bookmarks] = await Promise.all([
      this.databaseService.db
        .select({ count: sql<number>`count(*)` })
        .from(bookmarksTable)
        .where(eq(bookmarksTable.user_id, userId))
        .then((result) => Number(result[0].count)),

      this.databaseService.db.query.bookmarksTable.findMany({
        where: (bookmarks, { eq }) => eq(bookmarks.user_id, userId),
        orderBy: (bookmarks, { desc }) => [desc(bookmarks.created_at)],
        limit: pageSize,
        offset,
      }),
    ]);

    return this.responseService.success({
      data: {
        list: bookmarks,
        pagination: {
          current: page,
          pageSize,
          total,
        },
      },
    });
  }
}
