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
} from '@bookmark/schemas';
import { BookmarkModel, IBookmarkDocument, IBookmarkLean } from '@/models/bookmark';
import { BusinessError } from '@/core/business-error';
import { bookmarkCodeMessages } from '@bookmark/code-definitions';
import { getPaginateOptions } from '@/utils/query-params.util';
import { BookmarkTagService } from './tag/bookmark.tag.service';
import { BookmarkCategoryService } from './category/bookmark.category.service';

export class BookmarkService {
  constructor(
    private readonly bookmarkCategoryService: BookmarkCategoryService,
    private readonly bookmarkTagService: BookmarkTagService
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

    const bookmark = await BookmarkModel.create({
      ...data,
      user: userId,
      categories: data.categoryIds || [],
      tags: data.tagIds || [],
    });
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

  async findOne(userId: string, id: string): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.findOne({ _id: id, user: userId })
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.notFound);
    }
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

    // 分页与排序参数
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

    const categories = await this.bookmarkCategoryService.search(userId, keyword);
    const tags = await this.bookmarkTagService.search(userId, keyword);

    return {
      bookmarks,
      categories,
      tags,
    };
  }
}
