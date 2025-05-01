import { BookmarkTagModel, IBookmarkTag } from '@/models/bookmark/index.js';
import { CreateTagBody, UpdateTagBody } from '@bookmark/schemas';
import { omit } from 'lodash-es';
import type { FilterQuery, UpdateQuery } from 'mongoose';

export class BookmarkTagService {
  constructor() {}

  async create(userId: string, data: CreateTagBody): Promise<IBookmarkTag> {
    const tag = await BookmarkTagModel.create({ ...data, user: userId });
    return tag;
  }

  async update(userId: string, data: UpdateTagBody): Promise<IBookmarkTag | null> {
    const filter: FilterQuery<IBookmarkTag> = { _id: data.id, user: userId };
    const update: UpdateQuery<IBookmarkTag> = { $set: omit(data, 'id') };
    return BookmarkTagModel.findOneAndUpdate(filter, update, { new: true });
  }

  async delete(userId: string, id: string): Promise<{ deletedCount?: number }> {
    return BookmarkTagModel.deleteOne({ _id: id, user: userId });
  }

  async findAll(userId: string): Promise<IBookmarkTag[]> {
    return BookmarkTagModel.find({ user: userId });
  }

  async findOne(userId: string, id: string): Promise<IBookmarkTag | null> {
    return BookmarkTagModel.findOne({ _id: id, user: userId });
  }
} 