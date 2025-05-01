import mongoose, { Schema, Types } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/shared/mongoose/common-transform.js';
import { IBaseDocument } from '@/shared/mongoose/mongoose-type.js';

// 书签
export interface IBookmark extends IBaseDocument {
  user: Types.ObjectId;
  url: string;
  icon: string;
  title: string;
  description?: string;
  visitCount?: number;
  isFavorite?: number;
  isPinned?: number;
  screenshotUrl?: string;
  lastVisitedAt?: string;
  categories: Types.ObjectId[];
  tags: Types.ObjectId[];
}

const BookmarkSchema = new Schema<IBookmark>(
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

export const BookmarkModel = mongoose.model<IBookmark>('Bookmark', BookmarkSchema); 