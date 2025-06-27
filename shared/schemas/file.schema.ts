import { z } from 'zod';

export const UploadStatusEnums = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
}

export const uploadBizTypes = {
  BOOKMARK: 'UPLOAD_BOOKMARK',
  AVATAR: 'UPLOAD_AVATAR',
}

export const StorageTypeEnums = {
  TEMP: 'TEMP',
  PERMANENT: 'PERMANENT',
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
  bizType: z.enum([uploadBizTypes.BOOKMARK, uploadBizTypes.AVATAR]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const uploadParamsSchema = z.object({
  bizType: z.enum([uploadBizTypes.BOOKMARK, uploadBizTypes.AVATAR]),
});

export  type UploadBizTypes = typeof uploadBizTypes[keyof typeof uploadBizTypes];
export type FileResponse = z.infer<typeof fileResponseSchema>;
export type UploadFileBody = z.infer<typeof uploadParamsSchema>;
