import type { FilterQuery, UpdateQuery } from 'mongoose';
import escapeStringRegexp from 'escape-string-regexp';
import {
  BookmarkCategoryModel,
  IBookmarkCategoryDocument,
  IBookmarkCategoryLean,
  IBookmarkTagDocument,
} from '@/models/bookmark/index.js';
import { CreateCategoryBody, UpdateCategoryBody, CategoryResponse } from '@bookmark/schemas';
import { omit } from 'lodash-es';
import { BusinessError } from '@/core/business-error';
import { bookmarkCategoryCodeMessages } from '@bookmark/code-definitions';

export class BookmarkCategoryService {
  constructor() {}

  async create(userId: string, data: CreateCategoryBody): Promise<CategoryResponse> {
    const exists = await BookmarkCategoryModel.exists({ name: data.name, user: userId });
    if (exists) {
      throw new BusinessError(bookmarkCategoryCodeMessages.existed);
    }
    const category = await BookmarkCategoryModel.create({ ...data, user: userId });
    return category.toJSON<CategoryResponse>();
  }

  async update(userId: string, data: UpdateCategoryBody): Promise<CategoryResponse> {
    const filter: FilterQuery<IBookmarkCategoryDocument> = { _id: data.id, user: userId };
    const update: UpdateQuery<IBookmarkCategoryDocument> = { $set: omit(data, 'id') };
    const category = await BookmarkCategoryModel.findOneAndUpdate(filter, update, { new: true });
    if (!category) {
      throw new BusinessError(bookmarkCategoryCodeMessages.updateError);
    }

    return category?.toJSON<CategoryResponse>();
  }

  async delete(userId: string, id: string): Promise<{ deletedCount?: number }> {
    return BookmarkCategoryModel.deleteOne({ _id: id, user: userId });
  }

  async findAll(userId: string): Promise<CategoryResponse[]> {
    return BookmarkCategoryModel.find({ user: userId }).lean<IBookmarkCategoryLean[]>();
  }

  async findOne(userId: string, id: string): Promise<CategoryResponse> {
    const category = await BookmarkCategoryModel.findOne({ _id: id, user: userId }).lean<IBookmarkCategoryLean>();

    if (!category) {
      throw new BusinessError(bookmarkCategoryCodeMessages.notFound);
    }
    return category;
  }
  async search(userId: string, keyword?: string): Promise<CategoryResponse[]> {
    if (!keyword) {
      return [];
    }
    const query: FilterQuery<IBookmarkTagDocument> = { user: userId };
    const keywordRegex = escapeStringRegexp(keyword.trim());
    query.$or = [{ name: { $regex: keywordRegex, $options: 'i' } }];
    return BookmarkCategoryModel.find(query).lean<IBookmarkCategoryLean[]>().limit(50);
  }
}
