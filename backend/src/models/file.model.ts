import mongoose, { Schema } from 'mongoose';
import { FileResponse, UploadStatusEnums, UploadBizTypeEnums, FileTypeEnums } from '@bookmark/schemas';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin';
import { commonTransform } from '@/shared/mongoose/common-transform';
import { CreateDocument, CreateLeanDocument } from '@/shared/mongoose/mongoose-type';

export type IFileDocument = CreateDocument<FileResponse, 'user'>;

export type IFIleDocumentLean = CreateLeanDocument<FileResponse>;

const FileSchema = new Schema<IFileDocument>(
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
      enum: [UploadBizTypeEnums.AVATAR, UploadBizTypeEnums.BOOKMARK],
    },
    fileType: {
      type: String,
      required: true,
      enum: [FileTypeEnums.AVATAR, FileTypeEnums.BOOKMARK, FileTypeEnums.TEMP],
    },
    updateStatus: {
      type: String,
      enum: [
        UploadStatusEnums.FAILED,
        UploadStatusEnums.PENDING,
        UploadStatusEnums.PROCESSING,
        UploadStatusEnums.SUCCESS,
      ],
      default: UploadStatusEnums.PENDING,
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

FileSchema.index({ user: 1, filename: 1, status: 1 });
FileSchema.plugin(leanTransformPlugin);

export const FileModel = mongoose.model<IFileDocument>('File', FileSchema);
