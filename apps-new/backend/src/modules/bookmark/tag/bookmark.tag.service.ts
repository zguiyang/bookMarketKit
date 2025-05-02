import { BookmarkTagModel, IBookmarkTagDocument, IBookmarkTagLean } from '@/models/bookmark/index.js';
import { CreateTagBody, UpdateTagBody, TagResponse } from '@bookmark/schemas';
import { omit } from 'lodash-es';
import type { FilterQuery, UpdateQuery } from 'mongoose';
import { BusinessError } from '@/core/business-error';
import { bookmarkTagCodeMessages } from '@/config/code-message.config';

export class BookmarkTagService {
  constructor() {}

  async create(userId: string, data: CreateTagBody): Promise<TagResponse> {
    const tag = await BookmarkTagModel.create({ ...data, user: userId });
    return tag.toJSON<TagResponse>();
  }

  async update(userId: string, data: UpdateTagBody): Promise<TagResponse | null> {
    const filter: FilterQuery<IBookmarkTagDocument> = { _id: data.id, user: userId };
    const update: UpdateQuery<IBookmarkTagDocument> = { $set: omit(data, 'id') };
    const tag = await BookmarkTagModel.findOneAndUpdate(filter, update, { new: true });
    if (!tag) {
      throw new BusinessError(bookmarkTagCodeMessages.updateError);
    }
    return tag?.toJSON<TagResponse>();
  }

  async delete(userId: string, id: string): Promise<{ deletedCount?: number }> {
    return BookmarkTagModel.deleteOne({ _id: id, user: userId });
  }

  async findAll(userId: string): Promise<TagResponse[]> {
    return BookmarkTagModel.find({ user: userId })
      .lean<IBookmarkTagLean[]>();
  }

  async findOne(userId: string, id: string): Promise<TagResponse | null> {
    return BookmarkTagModel.findOne({ _id: id, user: userId })
      .lean<IBookmarkTagLean>();
  }
} 