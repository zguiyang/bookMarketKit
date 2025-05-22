import { omit } from 'lodash-es';
import { Types, FilterQuery } from 'mongoose';
import escapeStringRegexp from 'escape-string-regexp';
import {
  BookmarkResponse,
  BookmarkListResponse,
  BookmarkPageListResponse,
  BookmarkCollectionResponse,
  CreateBookmarkBody,
  UpdateBookmarkBody,
  SetFavoriteBody,
  SetPinnedBody,
  BookmarkPageListQuery,
  BookmarkPinnedEnum,
  BookmarkSearchResponse,
  BookmarkImportBody,
} from '@bookmark/schemas';
import { QueueConfig } from '@/config/constant.config';
import { BookmarkModel, IBookmarkDocument, IBookmarkLean } from '@/models/bookmark';
import { BusinessError } from '@/lib/business-error';
import { bookmarkCodeMessages } from '@bookmark/code-definitions';
import { getPaginateOptions } from '@/utils/query-params';
import { isValidUrl } from '@/utils/url';
import { parseHtmlBookmarks } from '@/lib/bookmark-parser';
import QueueLib from '@/lib/queue';
import { BookmarkTagService } from './tag/bookmark.tag.service';
import { BookmarkCategoryService } from './category/bookmark.category.service';
import { WebsiteMetaService } from '@/services/website/website-meta.service';
import { BookmarkFetchTask } from '@/interfaces/queue.interface';

export class BookmarkService {
  constructor(
    private readonly categoryService: BookmarkCategoryService,
    private readonly tagService: BookmarkTagService,
    private readonly websiteMetaService: WebsiteMetaService
  ) {}

  async create(userId: string, data: CreateBookmarkBody): Promise<BookmarkResponse> {
    const exists = await BookmarkModel.exists({
      $or: [
        {
          title: data.title,
          user: userId,
        },
        {
          url: data.url,
          user: userId,
        },
      ],
      user: userId,
    });
    if (exists) {
      throw new BusinessError(bookmarkCodeMessages.existed);
    }

    if (!isValidUrl(data.url)) {
      throw new BusinessError(bookmarkCodeMessages.createErrorWithUrl);
    }

    const bookmark = await BookmarkModel.create({
      ...data,
      user: userId,
      categories: data.categoryIds || [],
      tags: data.tagIds || [],
    });

    const newMeta = await this.websiteMetaService.create({
      url: data.url,
      bookmarkId: bookmark._id.toString(),
    });

    await QueueLib.addTask<BookmarkFetchTask>(
      QueueConfig.bookmark.fetchMeta,
      {
        bookmarkId: bookmark._id.toString(),
        metaId: newMeta._id.toString(),
        url: data.url,
        userId,
      },
      60 * 60 * 12 // 12 hours expire
    );

    return bookmark.toJSON<BookmarkResponse>();
  }

  async update(userId: string, data: UpdateBookmarkBody): Promise<BookmarkResponse> {
    const updateData = {
      ...omit(data, ['id', 'categoryIds', 'tagIds']),
      ...(data.categoryIds && { categories: data.categoryIds }),
      ...(data.tagIds && { tags: data.tagIds }),
    };

    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: data.id, user: userId },
      { $set: updateData },
      { new: true }
    )
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.updateError);
    }

    return bookmark;
  }

  async delete(userId: string, id: string) {
    return await BookmarkModel.deleteOne({ _id: id, user: userId });
  }

  async favorite(userId: string, data: SetFavoriteBody): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: data.id, user: userId },
      { isFavorite: data.favorite },
      { new: true }
    )
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.notFound);
    }

    return bookmark;
  }

  async pinned(userId: string, data: SetPinnedBody): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: data.id, user: userId },
      { isPinned: data.pinned },
      { new: true }
    )
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.notFound);
    }

    return bookmark;
  }

  async findAll(userId: string): Promise<BookmarkListResponse> {
    const bookmarks = await BookmarkModel.find({ user: userId })
      .populate(['categories', 'tags'])
      .sort({ createdAt: -1 })
      .lean<IBookmarkLean[]>();
    return bookmarks;
  }

  async findOne(userId: string, id: string): Promise<BookmarkResponse | null> {
    const bookmark = await BookmarkModel.findOne({ _id: id, user: userId })
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();
    return bookmark;
  }

  async findByFields(userId: string, query: FilterQuery<IBookmarkDocument>): Promise<BookmarkResponse | null> {
    const bookmark = await BookmarkModel.findOne(query).lean<IBookmarkLean>();
    return bookmark;
  }

  async pageList(userId: string, query: BookmarkPageListQuery): Promise<BookmarkPageListResponse> {
    const { isPinned, isFavorite, keyword, tagId, categoryId } = query;

    const filter: any = { user: userId };

    // 构建查询条件
    if (isPinned !== undefined) {
      filter.isPinned = isPinned;
    }
    if (isFavorite !== undefined) {
      filter.isFavorite = isFavorite;
    }
    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' };
    }
    if (categoryId) {
      filter.categories = new Types.ObjectId(categoryId);
    }
    if (tagId) {
      filter.tags = new Types.ObjectId(tagId);
    }

    const { page, pageSize, skip, sort } = getPaginateOptions(query);

    // 查询总数
    const total = await BookmarkModel.countDocuments(filter);
    // 查询分页内容
    const bookmarks = await BookmarkModel.find(filter)
      .populate(['categories', 'tags'])
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .lean<IBookmarkLean[]>();

    const pages = Math.ceil(total / pageSize);

    return {
      page,
      pageSize,
      pages,
      content: bookmarks,
      total,
    };
  }

  async findCollection(userId: string): Promise<BookmarkCollectionResponse> {
    const [pinnedBookmarks, recentBookmarks, recentAddedBookmarks] = await Promise.all([
      // 置顶书签
      BookmarkModel.find({ user: userId, isPinned: BookmarkPinnedEnum.YES })
        .populate(['categories', 'tags'])
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean<IBookmarkLean[]>(),

      // 最近访问的书签
      BookmarkModel.find({ user: userId, lastVisitedAt: { $exists: true } })
        .populate(['categories', 'tags'])
        .sort({ lastVisitedAt: -1 })
        .limit(10)
        .lean<IBookmarkLean[]>(),

      // 最近添加的书签
      BookmarkModel.find({ user: userId })
        .populate(['categories', 'tags'])
        .sort({ createdAt: -1 })
        .limit(10)
        .lean<IBookmarkLean[]>(),
    ]);

    return {
      pinnedBookmarks,
      recentBookmarks,
      recentAddedBookmarks,
    };
  }

  async updateLastVisitTime(userId: string, id: string): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: id, user: userId },
      {
        lastVisitedAt: new Date(),
        $inc: { visitCount: 1 },
      },
      { new: true }
    )
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.notFound);
    }

    return bookmark;
  }

  async search(userId: string, keyword?: string): Promise<BookmarkSearchResponse> {
    if (!keyword) {
      return {
        bookmarks: [],
        categories: [],
        tags: [],
      };
    }
    const query: FilterQuery<IBookmarkDocument> = { user: userId };
    const keywordRegex = escapeStringRegexp(keyword.trim());
    query.$or = [{ title: { $regex: keywordRegex, $options: 'i' } }];
    const bookmarks = await BookmarkModel.find(query)
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean[]>()
      .limit(50);

    const categories = await this.categoryService.search(userId, keyword);
    const tags = await this.tagService.search(userId, keyword);

    return {
      bookmarks,
      categories,
      tags,
    };
  }

  async import(userId: string, data: BookmarkImportBody) {
    const { bookmarks, categories } = await parseHtmlBookmarks(data.filePath);

    // 导入结果统计
    const result = {
      totalCategories: categories.length,
      totalBookmarks: bookmarks.length,
      importedCategories: 0,
      importedBookmarks: 0,
      errors: [] as string[],
    };

    const categoryNameToIdMap = new Map<string, string>();

    const sortedCategories = [...categories].sort((a, b) => {
      if (!a.parent) return -1;
      if (!b.parent) return 1;
      return 0;
    });

    // 创建分类
    for (const category of sortedCategories) {
      const exists = await this.categoryService.findByFields(userId, {
        name: category.name,
      });
      if (exists) {
        categoryNameToIdMap.set(category.name, exists._id);
        continue;
      }

      try {
        let parentId = null;
        if (category.parent && categoryNameToIdMap.has(category.parent)) {
          parentId = categoryNameToIdMap.get(category.parent) || null;
        }

        const createdCategory = await this.categoryService.create(userId, {
          name: category.name,
          parent: parentId,
        });

        categoryNameToIdMap.set(category.name, createdCategory._id);

        result.importedCategories++;
      } catch (error: any) {
        result.errors.push(`导入分类 "${category.name}" 失败: ${error.message}`);
      }
    }

    for (const bookmark of bookmarks) {
      const { title, url } = bookmark;
      const existingBookmark = await this.findByFields(userId, {
        $or: [{ title }, { url }],
      });
      if (existingBookmark) {
        continue;
      }
      try {
        const categoryIds: string[] = [];
        if (bookmark.categoryPath.length > 0) {
          const categoryName = bookmark.categoryPath[bookmark.categoryPath.length - 1];
          if (categoryNameToIdMap.has(categoryName)) {
            const categoryId = categoryNameToIdMap.get(categoryName);
            if (categoryId) {
              categoryIds.push(categoryId);
            }
          }
        }

        await this.create(userId, {
          title: bookmark.title || bookmark.url,
          url: bookmark.url,
          icon: `${bookmark.url}/favicon.ico`,
          categoryIds,
          tagIds: [],
        });

        result.importedBookmarks++;
      } catch (error: any) {
        result.errors.push(`导入书签 "${bookmark.title}, ${bookmark.url}" 失败: ${error.message}`);
      }
    }

    return result;
  }
}
