import { z } from 'zod';

export const UploadStatusEnum = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export const UploadBizTypeEnum = {
  BOOKMARK: 'BOOKMARK',
  AVATAR: 'AVATAR',
} as const;

export const fileResponseSchema = z.object({
  _id: z.string(),
  user: z.string(),
  filename: z.string(),
  originalName: z.string(),
  path: z.string(),
  size: z.number(),
  mimeType: z.string(),
  status: z.enum([
    UploadStatusEnum.PENDING,
    UploadStatusEnum.PROCESSING,
    UploadStatusEnum.SUCCESS,
    UploadStatusEnum.FAILED,
  ]),
  bizType: z.enum([UploadBizTypeEnum.BOOKMARK, UploadBizTypeEnum.AVATAR]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const uploadParamsSchema = z.object({
  bizType: z.enum([UploadBizTypeEnum.BOOKMARK, UploadBizTypeEnum.AVATAR]),
});

export type FileResponse = z.infer<typeof fileResponseSchema>;
export type UploadFileBody = z.infer<typeof uploadParamsSchema>;
