import mongoose, { Schema, Types } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/shared/mongoose/common-transform.js';
import { IBaseDocument } from '@/shared/mongoose/mongoose-type.js';

// 书签标签
export interface IBookmarkTag extends IBaseDocument {
  user: Types.ObjectId;
  name: string;
  color?: string;
}

const BookmarkTagSchema = new Schema<IBookmarkTag>(
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

export const BookmarkTagModel = mongoose.model<IBookmarkTag>('BookmarkTag', BookmarkTagSchema);