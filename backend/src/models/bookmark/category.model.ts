import mongoose, { Schema } from 'mongoose';
import type { CategoryResponse } from '~shared/schemas';

import leanTransformPlugin from '@/utils/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/utils/mongoose/common-transform.js';
import type { CreateDocument, CreateLeanDocument } from '@/utils/mongoose/mongoose-type.js';

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

export const CategoryModel = mongoose.model<IBookmarkCategoryDocument>('BookmarkCategory', BookmarkCategorySchema);
