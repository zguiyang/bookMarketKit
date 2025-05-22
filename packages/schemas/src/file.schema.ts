import { z } from 'zod';

export enum UploadStatusEnums {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum UploadBizTypeEnums {
  BOOKMARK = 'UPLOAD_BOOKMARK',
  AVATAR = 'UPLOAD_AVATAR',
}

export enum StorageTypeEnums {
  TEMP = 'TEMP',
  PERMANENT = 'PERMANENT',
}

export const fileResponseSchema = z.object({
  _id: z.string(),
  user: z.string(),
  filename: z.string(),
  originalName: z.string(),
  path: z.string(),
  size: z.number(),
  mimeType: z.string(),
  storageType: z.enum([StorageTypeEnums.TEMP, StorageTypeEnums.PERMANENT]),
  updateStatus: z.enum([
    UploadStatusEnums.PENDING,
    UploadStatusEnums.PROCESSING,
    UploadStatusEnums.SUCCESS,
    UploadStatusEnums.FAILED,
  ]),
  bizType: z.enum([UploadBizTypeEnums.BOOKMARK, UploadBizTypeEnums.AVATAR]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const uploadParamsSchema = z.object({
  bizType: z.enum([UploadBizTypeEnums.BOOKMARK, UploadBizTypeEnums.AVATAR]),
});

export type FileResponse = z.infer<typeof fileResponseSchema>;
export type UploadFileBody = z.infer<typeof uploadParamsSchema>;
