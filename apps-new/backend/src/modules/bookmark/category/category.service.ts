import { BookmarkCategoryModel, IBookmarkCategory } from '@/models/bookmark/index.js';
import { CreateCategoryBody, UpdateCategoryBody } from '@bookmark/schemas';
import { omit } from 'lodash-es';
import type { FilterQuery, UpdateQuery } from 'mongoose';

export class BookmarkCategoryService {
  constructor() {}

  async create(userId: string, data: CreateCategoryBody): Promise<IBookmarkCategory> {
    const category = await BookmarkCategoryModel.create({ ...data, user: userId });
    return category;
  }

  async update(userId: string, data: UpdateCategoryBody): Promise<IBookmarkCategory | null> {
    const filter: FilterQuery<IBookmarkCategory> = { _id: data.id, user: userId };
    const update: UpdateQuery<IBookmarkCategory> = { $set: omit(data, 'id') };
    return BookmarkCategoryModel.findOneAndUpdate(filter, update, { new: true });
  }

  async delete(userId: string, id: string): Promise<{ deletedCount?: number }> {
    return BookmarkCategoryModel.deleteOne({ _id: id, user: userId });
  }

  async findAll(userId: string): Promise<IBookmarkCategory[]> {
    return BookmarkCategoryModel.find({ user: userId });
  }

  async findOne(userId: string, id: string): Promise<IBookmarkCategory | null> {
    return BookmarkCategoryModel.findOne({ _id: id, user: userId });
  }
}
