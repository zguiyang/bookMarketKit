import { uploadParamsSchema, uploadResponseSchema } from '@bookmark/schemas';

export const uploadSchemas = {
  add: {
    tags: ['Upload'],
    summary: '文件上传',
    description: '文件上传',
    consumes: ['multipart/form-data'],
    params: uploadParamsSchema,
    response: {
      201: uploadResponseSchema,
    },
  },
};
