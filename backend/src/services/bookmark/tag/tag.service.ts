import type { FilterQuery, UpdateQuery } from 'mongoose';
import escapeStringRegexp from 'escape-string-regexp';
import { TagModel, IBookmarkTagDocument, IBookmarkTagLean } from '@/models/bookmark/index.js';
import { CreateTagBody, UpdateTagBody, TagResponse } from '@bookmark/schemas';
import { omit } from 'lodash-es';
import { BusinessError } from '@/lib/business-error.js';
import { bookmarkTagCodeMessages } from '@bookmark/code-definitions';

export class TagService {
  constructor() {}

  async create(userId: string, data: CreateTagBody): Promise<TagResponse> {
    const exists = await TagModel.exists({ name: data.name, user: userId });
    if (exists) {
      throw new BusinessError(bookmarkTagCodeMessages.existed);
    }
    const tag = await TagModel.create({ ...data, user: userId });
    return tag.toJSON<TagResponse>();
  }

  async update(userId: string, data: UpdateTagBody): Promise<TagResponse | null> {
    const filter: FilterQuery<IBookmarkTagDocument> = { _id: data.id, user: userId };
    const update: UpdateQuery<IBookmarkTagDocument> = { $set: omit(data, 'id') };
    const tag = await TagModel.findOneAndUpdate(filter, update, { new: true });
    if (!tag) {
      throw new BusinessError(bookmarkTagCodeMessages.updateError);
    }
    return tag?.toJSON<TagResponse>();
  }

  async delete(userId: string, id: string): Promise<{ deletedCount?: number }> {
    return TagModel.deleteOne({ _id: id, user: userId });
  }

  async findAll(userId: string): Promise<TagResponse[]> {
    return TagModel.find({ user: userId }).lean<IBookmarkTagLean[]>();
  }

  async findOne(userId: string, id: string): Promise<TagResponse> {
    const tag = await TagModel.findOne({ _id: id, user: userId }).lean<IBookmarkTagLean>();
    if (!tag) {
      throw new BusinessError(bookmarkTagCodeMessages.notFound);
    }
    return tag;
  }
  async search(userId: string, keyword?: string): Promise<TagResponse[]> {
    if (!keyword) {
      return [];
    }
    const query: FilterQuery<IBookmarkTagDocument> = { user: userId };
    const keywordRegex = escapeStringRegexp(keyword.trim());
    query.$or = [{ name: { $regex: keywordRegex, $options: 'i' } }];
    return TagModel.find(query).lean<IBookmarkTagLean[]>().limit(50);
  }
}
