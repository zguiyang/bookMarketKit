import mongoose, { Schema } from 'mongoose';
import leanTransformPlugin from '@/utils/mongoose/leanTransformPlugin';
import { commonTransform } from '@/utils/mongoose/common-transform';
import type { TagResponse } from '~shared/schemas';
import type { CreateDocument, CreateLeanDocument } from '@/utils/mongoose/mongoose-type';

// Mongoose 文档类型
export type IBookmarkTagDocument = CreateDocument<TagResponse, 'user'>;

// Lean 查询结果类型
export type IBookmarkTagLean = CreateLeanDocument<TagResponse>;

const BookmarkTagSchema = new Schema<IBookmarkTagDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    color: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: commonTransform,
    },
  }
);

BookmarkTagSchema.plugin(leanTransformPlugin);

export const TagModel = mongoose.model<IBookmarkTagDocument>('BookmarkTag', BookmarkTagSchema);
