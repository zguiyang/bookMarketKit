import { BookmarkCategoryModel, IBookmarkCategoryDocument, IBookmarkCategoryLean } from '@/models/bookmark/index.js';
import { CreateCategoryBody, UpdateCategoryBody, CategoryResponse } from '@bookmark/schemas';
import { omit } from 'lodash-es';
import type { FilterQuery, UpdateQuery } from 'mongoose';
import { BusinessError } from '@/core/business-error';
import { bookmarkCategoryCodeMessages } from '@/config/code-message.config';

export class BookmarkCategoryService {
  constructor() {}

  async create(userId: string, data: CreateCategoryBody): Promise<CategoryResponse> {
    const category = await BookmarkCategoryModel.create({ ...data, user: userId });
    return category.toJSON<CategoryResponse>();
  }

  async update(userId: string, data: UpdateCategoryBody): Promise<CategoryResponse> {
    const filter: FilterQuery<IBookmarkCategoryDocument> = { _id: data.id, user: userId };
    const update: UpdateQuery<IBookmarkCategoryDocument> = { $set: omit(data, 'id') };
    const category = await BookmarkCategoryModel.findOneAndUpdate(filter, update, { new: true });
    if (!category) {
      throw new BusinessError(bookmarkCategoryCodeMessages.updateCategoryError);
    }

    return category?.toJSON<CategoryResponse>();
  }

  async delete(userId: string, id: string): Promise<{ deletedCount?: number }> {
    return BookmarkCategoryModel.deleteOne({ _id: id, user: userId });
  }

  async findAll(userId: string): Promise<CategoryResponse[]> {
    return BookmarkCategoryModel.find({ user: userId })
      .lean<IBookmarkCategoryLean[]>();
  }

  async findOne(userId: string, id: string): Promise<CategoryResponse | null> {
    return BookmarkCategoryModel.findOne({ _id: id, user: userId })
      .lean<IBookmarkCategoryLean>();
  }
}
