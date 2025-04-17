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
import { PageDirectionEnum } from '@/dto/pagination.dto';

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
        icon: bookmarkData.icon,
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

  /**
   * 构建书签查询条件
   */
  private _buildBookmarkWhereConditions(
    userId: string,
    query: Partial<BookmarkPageListRequestDTO>,
  ) {
    const whereConditions = [eq(bookmarksTable.user_id, userId)];

    const { isPinned, isFavorite, title, tagId, categoryId } = query;

    if (isPinned !== undefined) {
      whereConditions.push(eq(bookmarksTable.is_pinned, isPinned));
    }
    if (isFavorite !== undefined) {
      whereConditions.push(eq(bookmarksTable.is_favorite, isFavorite));
    }
    if (title) {
      whereConditions.push(sql`${bookmarksTable.title} ILIKE ${`%${title}%`}`);
    }
    if (tagId) {
      whereConditions.push(sql`EXISTS (
        SELECT 1 FROM bookmark_tags bt 
        WHERE bt.bookmark_id = ${bookmarksTable.id} 
        AND bt.tag_id = ${tagId}
      )`);
    }
    if (categoryId) {
      whereConditions.push(sql`EXISTS (
        SELECT 1 FROM bookmark_categories bc 
        WHERE bc.bookmark_id = ${bookmarksTable.id} 
        AND bc.category_id = ${categoryId}
      )`);
    }

    return whereConditions;
  }

  async pageList(
    userId: string,
    query: BookmarkPageListRequestDTO,
  ): Promise<PageListData<SelectBookmark>> {
    const { page, pageSize, orderBy, direction } = query;

    const offset = (page - 1) * pageSize;
    const whereConditions = this._buildBookmarkWhereConditions(userId, query);

    const [total, bookmarks] = await Promise.all([
      // 获取总数
      this.database
        .select({ count: sql<number>`count(*)` })
        .from(bookmarksTable)
        .where(and(...whereConditions))
        .then((result) => Number(result[0].count)),

      // 获取分页数据
      this.database.query.bookmarksTable.findMany({
        where: (bookmarks, { and }) => and(...whereConditions),
        orderBy: (bookmarks, { asc, desc }) => [
          direction === PageDirectionEnum.ASC
            ? asc(bookmarks[orderBy as keyof typeof bookmarks])
            : desc(bookmarks[orderBy as keyof typeof bookmarks]),
        ],
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

    return {
      content: bookmarks.map((bookmark) =>
        this._processBookmarkRelations(bookmark),
      ),
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取书签集合数据
   * 目前包含：
   * 1. 置顶书签列表
   * 2. 最近访问书签列表（不包含置顶书签）
   * 3. 最近3天新增的书签列表
   */
  async findCollection(userId: string): Promise<{
    pinnedBookmarks: SelectBookmark[];
    recentBookmarks: SelectBookmark[];
    recentAddedBookmarks: SelectBookmark[];
  }> {
    const [pinnedBookmarks, recentBookmarks, recentAddedBookmarks] =
      await Promise.all([
        // 获取置顶书签
        this.database.query.bookmarksTable.findMany({
          where: (bookmarks, { eq, and }) =>
            and(eq(bookmarks.user_id, userId), eq(bookmarks.is_pinned, 1)),
          orderBy: (bookmarks, { desc }) => [desc(bookmarks.updated_at)],
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

        // 获取最近访问的书签（不包括置顶的）
        this.database.query.bookmarksTable.findMany({
          where: (bookmarks, { eq, and, isNotNull }) =>
            and(
              eq(bookmarks.user_id, userId),
              eq(bookmarks.is_pinned, 0),
              isNotNull(bookmarks.last_visited_at),
            ),
          orderBy: (bookmarks, { desc }) => [desc(bookmarks.last_visited_at)],
          limit: 10,
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

        // 获取最近3天新增的书签
        this.database.query.bookmarksTable.findMany({
          where: (bookmarks, { eq, and, gt }) =>
            and(
              eq(bookmarks.user_id, userId),
              gt(bookmarks.created_at, sql`NOW() - INTERVAL '3 days'`),
            ),
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
        }),
      ]);

    return {
      pinnedBookmarks: pinnedBookmarks.map((bookmark) =>
        this._processBookmarkRelations(bookmark),
      ),
      recentBookmarks: recentBookmarks.map((bookmark) =>
        this._processBookmarkRelations(bookmark),
      ),
      recentAddedBookmarks: recentAddedBookmarks.map((bookmark) =>
        this._processBookmarkRelations(bookmark),
      ),
    };
  }

  /**
   * 更新书签的最后访问时间和访问计数
   * @param userId 用户ID
   * @param bookmarkId 书签ID
   */
  async updateLastVisitTime(userId: string, bookmarkId: string) {
    const bookmark = await this.findOne(userId, bookmarkId);

    if (!bookmark) {
      throw new BusinessException(bookmarksCodeMessages.notFoundBookmark);
    }

    const result = await this.database
      .update(bookmarksTable)
      .set({
        [bookmarksTable.last_visited_at.name]: sql`NOW()`,
        [bookmarksTable.visit_count.name]:
          sql`${bookmarksTable.visit_count} + 1`,
      })
      .where(
        and(
          eq(bookmarksTable.id, bookmarkId),
          eq(bookmarksTable.user_id, userId),
        ),
      );

    if (result.rowCount < 1) {
      throw new BusinessException(bookmarksCodeMessages.updateError);
    }
  }
}
