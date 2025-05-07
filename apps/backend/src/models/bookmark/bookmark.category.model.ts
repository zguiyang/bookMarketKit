import mongoose, { Schema } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/shared/mongoose/common-transform.js';
import { CategoryResponse } from '@bookmark/schemas';
import { CreateDocument, CreateLeanDocument } from '@/shared/mongoose/mongoose-type.js';

// Mongoose 文档类型
export type IBookmarkCategoryDocument = CreateDocument<CategoryResponse, 'user' | 'parent'>;

// Lean 查询结果类型
export type IBookmarkCategoryLean = CreateLeanDocument<CategoryResponse>;

const BookmarkCategorySchema = new Schema<IBookmarkCategoryDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'BookmarkCategory', default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: commonTransform,
    },
  }
);

BookmarkCategorySchema.plugin(leanTransformPlugin);

export const BookmarkCategoryModel = mongoose.model<IBookmarkCategoryDocument>(
  'BookmarkCategory',
  BookmarkCategorySchema
);
