import mongoose, { Schema, Types } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/shared/mongoose/common-transform.js';
import { IBaseDocument } from '@/shared/mongoose/mongoose-type.js';

// 书签分类
export interface IBookmarkCategory extends IBaseDocument {
  user: Types.ObjectId;
  name: string;
  description?: string;
  icon?: string;
  parent?: string;
}

const BookmarkCategorySchema = new Schema<IBookmarkCategory>(
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
      transform: commonTransform
    }
   }
);

BookmarkCategorySchema.plugin(leanTransformPlugin);

export const BookmarkCategoryModel = mongoose.model<IBookmarkCategory>('BookmarkCategory', BookmarkCategorySchema);