import mongoose, { Schema } from 'mongoose';
import { type WebsiteMetaModelSchema, WebsiteMetaFetchEnums } from '~shared/schemas';
import leanTransformPlugin from '@/utils/mongoose/leanTransformPlugin';
import type { CreateDocument, CreateLeanDocument } from '@/utils/mongoose/mongoose-type';
import { commonTransform } from '@/utils/mongoose/common-transform';

export type IWebsiteMetaDocument = CreateDocument<WebsiteMetaModelSchema, 'bookmark'>;
export type IWebsiteMetaLeanDocument = CreateLeanDocument<WebsiteMetaModelSchema>;

const WebsiteMetaSchema = new Schema<IWebsiteMetaDocument>(
  {
    url: { type: String, required: true },
    bookmark: {
      type: Schema.Types.ObjectId,
      ref: 'Bookmark',
      required: true,
    },
    ogsResult: {
      type: String,
    },
    ogsResponse: {
      type: String,
    },
    ogsHtml: {
      type: String,
    },
    error: { type: String },
    fetchStatus: {
      type: String,
      enum: [WebsiteMetaFetchEnums.SUCCESS, WebsiteMetaFetchEnums.FAILED],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: commonTransform,
    },
  }
);

WebsiteMetaSchema.plugin(leanTransformPlugin);

export const WebsiteMetaModel = mongoose.model<IWebsiteMetaDocument>('WebsiteMeta', WebsiteMetaSchema);
