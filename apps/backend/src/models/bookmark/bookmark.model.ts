import mongoose, { Schema, Types } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/shared/mongoose/common-transform.js';
import { BookmarkResponse } from '@bookmark/schemas';
import { CreateDocument, CreateLeanDocument } from '@/shared/mongoose/mongoose-type.js';

// Mongoose 文档类型
export type IBookmarkDocument = CreateDocument<
  BookmarkResponse,
  'user' | 'categories' | 'tags'
>;

// Lean 查询结果类型
export type IBookmarkLean = CreateLeanDocument<BookmarkResponse>;

const BookmarkSchema = new Schema<IBookmarkDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    visitCount: { type: Number, default: 0 },
    isFavorite: { type: Number, default: 0 },
    isPinned: { type: Number, default: 0 },
    screenshotUrl: { type: String },
    lastVisitedAt: { type: Date },
    categories: [{ type: Schema.Types.ObjectId, ref: 'BookmarkCategory' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'BookmarkTag' }],
  },
  { 
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: commonTransform
    }
   }
);

BookmarkSchema.plugin(leanTransformPlugin);

export const BookmarkModel = mongoose.model<IBookmarkDocument>('Bookmark', BookmarkSchema); 