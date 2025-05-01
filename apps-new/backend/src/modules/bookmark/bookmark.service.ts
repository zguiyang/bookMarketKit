import { omit } from 'lodash-es';
import { Types } from 'mongoose';
import {
  CreateBookmarkBody,
  UpdateBookmarkBody,
  SetFavoriteBody,
  SetPinnedBody,
  BookmarkPageListQuery,
  BookmarkCollectionResponse,
  BookmarkResponse,
  BookmarkPageListResponse,
} from '@bookmark/schemas';
import { BookmarkModel, IBookmark, BookmarkCategoryModel, BookmarkTagModel } from '@/models/bookmark/index.js';
import { BusinessError } from '@/core/business-error';
import { bookmarkCodeMessages} from '@/config/code-message.config';
import { getPaginateOptions } from '@/utils/query-params.util';


export class BookmarkService {
  constructor() {}

  async create(userId: string, data: CreateBookmarkBody): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.create({
      ...data,
      user: userId,
      categories: data.categoryIds || [],
      tags: data.tagIds || [],
    });
    return bookmark as unknown as BookmarkResponse;
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
    ).populate(['categories', 'tags']).lean();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.updateError);
    }

    return bookmark as unknown as BookmarkResponse;
  }

  async delete(userId: string, id: string) {
    return await BookmarkModel.deleteOne({ _id: id, user: userId });
  }

  async favorite(userId: string, data: SetFavoriteBody) {
    return BookmarkModel.findOneAndUpdate(
      { _id: data.id, user: userId },
      { isFavorite: !!data.isFavorite },
      { new: true }
    ).populate(['categories', 'tags']);
  }

  async pinned(userId: string, data: SetPinnedBody) {
    return BookmarkModel.findOneAndUpdate(
      { _id: data.id, user: userId },
      { isPinned: !!data.isPinned },
      { new: true }
    ).populate(['categories', 'tags']);
  }

  async findAll(userId: string): Promise<BookmarkResponse[]> {
    const bookmarks = await BookmarkModel.find({ user: userId })
      .populate(['categories', 'tags'])
      .sort({ createdAt: -1 })
      .lean();
    return bookmarks as unknown as BookmarkResponse[];
  }

  async findOne(userId: string, id: string): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.findOne({ _id: id, user: userId })
      .populate(['categories', 'tags'])
      .lean();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.notFoundBookmark);
    }
    return bookmark as unknown as BookmarkResponse;
  }

  async pageList(userId: string, query: BookmarkPageListQuery): Promise<BookmarkPageListResponse> {
    const {
      isPinned,
      isFavorite,
      keyword,
      tagId,
      categoryId,
      orderBy,
      direction,
    } = query;

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
      .lean();

    const pages = Math.ceil(total / pageSize);

    return {
      page,
      pageSize,
      pages,
      content: bookmarks as unknown as BookmarkResponse[],
      total,
    };
  }

  async findCollection(userId: string): Promise<BookmarkCollectionResponse> {
    const [pinnedBookmarks, recentBookmarks, recentAddedBookmarks] = await Promise.all([
      // 置顶书签
      BookmarkModel.find({ user: userId, isPinned: true })
        .populate(['categories', 'tags'])
        .sort({ updatedAt: -1 })
        .limit(10).lean(),

      // 最近访问的书签
      BookmarkModel.find({ user: userId, lastVisitedAt: { $exists: true } })
        .populate(['categories', 'tags'])
        .sort({ lastVisitedAt: -1 })
        .limit(10).lean(),

      // 最近添加的书签
      BookmarkModel.find({ user: userId })
        .populate(['categories', 'tags'])
        .sort({ createdAt: -1 })
        .limit(10).lean(),
    ]);

    return {
      pinnedBookmarks: pinnedBookmarks as unknown as BookmarkResponse[],
      recentBookmarks: recentBookmarks as unknown as BookmarkResponse[],
      recentAddedBookmarks: recentAddedBookmarks as unknown as BookmarkResponse[],
    };
  }

  async updateLastVisitTime(userId: string, id: string) {
    return BookmarkModel.findOneAndUpdate(
      { _id: id, user: userId },
      { 
        lastVisitedAt: new Date(),
        $inc: { visitCount: 1 }
      },
      { new: true }
    ).populate(['categories', 'tags']);
  }

  async search(userId: string, keyword: string) {
    const [bookmarks, categories, tags] = await Promise.all([
      // 搜索书签
      BookmarkModel.find({
        user: userId,
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { url: { $regex: keyword, $options: 'i' } }
        ]
      }).populate(['categories', 'tags']),

      // 搜索分类
      BookmarkCategoryModel.find({
        user: userId,
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ]
      }),

      // 搜索标签
      BookmarkTagModel.find({
        user: userId,
        name: { $regex: keyword, $options: 'i' }
      })
    ]);

    return {
      bookmarks,
      categories,
      tags
    };
  }
} 