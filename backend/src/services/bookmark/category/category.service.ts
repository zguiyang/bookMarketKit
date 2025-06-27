import type { FilterQuery, UpdateQuery } from 'mongoose';
import escapeStringRegexp from 'escape-string-regexp';
import {
  CategoryModel,
} from '@/models/bookmark';
import type {
  IBookmarkCategoryDocument,
  IBookmarkCategoryLean,
  IBookmarkTagDocument,
} from '@/models/bookmark';
import type { CreateCategoryBody, UpdateCategoryBody, CategoryResponse } from '~shared/schemas';
import { omit } from 'lodash-es';
import { BusinessError } from '@/lib/business-error.js';
import { bookmarkCategoryCodeMessages } from '~shared/code-definitions';

export class CategoryService {
  constructor() {}

  async create(userId: string, data: CreateCategoryBody): Promise<CategoryResponse> {
    const exists = await CategoryModel.exists({ name: data.name, user: userId });
    if (exists) {
      throw new BusinessError(bookmarkCategoryCodeMessages.existed);
    }
    const category = await CategoryModel.create({ ...data, user: userId });
    return category.toJSON<CategoryResponse>();
  }

  async update(userId: string, data: UpdateCategoryBody): Promise<CategoryResponse> {
    const filter: FilterQuery<IBookmarkCategoryDocument> = { _id: data.id, user: userId };
    const update: UpdateQuery<IBookmarkCategoryDocument> = { $set: omit(data, 'id') };
    const category = await CategoryModel.findOneAndUpdate(filter, update, { new: true });
    if (!category) {
      throw new BusinessError(bookmarkCategoryCodeMessages.updateError);
    }

    return category?.toJSON<CategoryResponse>();
  }

  async delete(userId: string, id: string): Promise<{ deletedCount?: number }> {
    return CategoryModel.deleteOne({ _id: id, user: userId });
  }

  async findAll(userId: string): Promise<CategoryResponse[]> {
    return CategoryModel.find({ user: userId }).lean<IBookmarkCategoryLean[]>();
  }

  async findOne(userId: string, id: string): Promise<CategoryResponse | null> {
    const category = await CategoryModel.findOne({ _id: id, user: userId }).lean<IBookmarkCategoryLean>();
    return category;
  }

  async findByFields(userId: string, query: FilterQuery<IBookmarkCategoryDocument>): Promise<CategoryResponse | null> {
    const category = await CategoryModel.findOne(query).lean<IBookmarkCategoryLean>();
    return category;
  }
  async search(userId: string, keyword?: string): Promise<CategoryResponse[]> {
    if (!keyword) {
      return [];
    }
    const query: FilterQuery<IBookmarkTagDocument> = { user: userId };
    const keywordRegex = escapeStringRegexp(keyword.trim());
    query.$or = [{ name: { $regex: keywordRegex, $options: 'i' } }];
    return CategoryModel.find(query).lean<IBookmarkCategoryLean[]>().limit(50);
  }
}
