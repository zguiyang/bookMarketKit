import { z } from 'zod';

export const UploadStatusEnums = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export const UploadBizTypeEnums = {
  BOOKMARK: 'UPLOAD_BOOKMARK',
  AVATAR: 'UPLOAD_AVATAR',
} as const;

export const FileTypeEnums = {
  BOOKMARK: 'BOOKMARK',
  AVATAR: 'AVATAR',
  TEMP: 'TEMP',
} as const;

export const fileResponseSchema = z.object({
  _id: z.string(),
  user: z.string(),
  filename: z.string(),
  originalName: z.string(),
  path: z.string(),
  size: z.number(),
  mimeType: z.string(),
  fileType: z.enum([FileTypeEnums.BOOKMARK, FileTypeEnums.AVATAR, FileTypeEnums.TEMP]),
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
