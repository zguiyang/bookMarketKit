import mongoose, { Schema } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/shared/mongoose/common-transform.js';
import { TagResponse } from '@bookmark/schemas';
import { CreateDocument, CreateLeanDocument } from '@/shared/mongoose/mongoose-type.js';

// Mongoose 文档类型
export type IBookmarkTagDocument = CreateDocument<
  TagResponse,
  'user'
>;

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
      transform: commonTransform
    }
   }
);

BookmarkTagSchema.plugin(leanTransformPlugin);

export const BookmarkTagModel = mongoose.model<IBookmarkTagDocument>('BookmarkTag', BookmarkTagSchema);