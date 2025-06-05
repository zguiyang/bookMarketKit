import mongoose, { Schema } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin';
import { commonTransform } from '@/shared/mongoose/common-transform';
import { BookmarkResponse, BookmarkFavoriteEnum, BookmarkPinnedEnum } from '@bookmark/schemas';
import { CreateDocument, CreateLeanDocument } from '@/shared/mongoose/mongoose-type';

// Mongoose document type
export type IBookmarkDocument = CreateDocument<BookmarkResponse, 'user' | 'categories' | 'tags' | 'meta'>;

// Lean query result type
export type IBookmarkLean = CreateLeanDocument<BookmarkResponse>;

const BookmarkSchema = new Schema<IBookmarkDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    icon: { type: String, required: false, default: null },
    title: { type: String, required: false, default: null },
    description: { type: String },
    visitCount: { type: Number, default: 0 },
    isFavorite: {
      type: String,
      enum: [BookmarkFavoriteEnum.YES, BookmarkFavoriteEnum.NO],
      default: BookmarkFavoriteEnum.NO,
    },
    isPinned: {
      type: String,
      enum: [BookmarkPinnedEnum.YES, BookmarkPinnedEnum.NO],
      default: BookmarkPinnedEnum.NO,
    },
    meta: {
      type: Schema.Types.ObjectId,
      ref: 'WebsiteMeta',
      default: null,
    },
    screenshotUrl: { type: String },
    lastVisitedAt: { type: Date },
    categories: [{ type: Schema.Types.ObjectId, ref: 'BookmarkCategory' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'BookmarkTag' }],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: commonTransform,
    },
  }
);

BookmarkSchema.plugin(leanTransformPlugin);

export const BookmarkModel = mongoose.model<IBookmarkDocument>('Bookmark', BookmarkSchema);
