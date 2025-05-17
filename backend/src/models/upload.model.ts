import mongoose, { Schema } from 'mongoose';
import { UploadResponse, UploadStatusEnum, UploadBizTypeEnum } from '@bookmark/schemas';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin';
import { commonTransform } from '@/shared/mongoose/common-transform';
import { CreateDocument, CreateLeanDocument } from '@/shared/mongoose/mongoose-type';

export type IUploadDocument = CreateDocument<UploadResponse, 'user'>;

export type IUploadLean = CreateLeanDocument<UploadResponse>;

const UploadSchema = new Schema<IUploadDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    bizType: {
      type: String,
      required: true,
      enum: [UploadBizTypeEnum.AVATAR, UploadBizTypeEnum.BOOKMARK],
    },
    status: {
      type: String,
      enum: [UploadStatusEnum.FAILED, UploadStatusEnum.PENDING, UploadStatusEnum.PROCESSING, UploadStatusEnum.SUCCESS],
      default: UploadStatusEnum.PENDING,
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

UploadSchema.index({ user: 1, filename: 1, status: 1 });
UploadSchema.plugin(leanTransformPlugin);

export const UploadModel = mongoose.model<IUploadDocument>('upload', UploadSchema);
