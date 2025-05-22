import { uploadParamsSchema, fileResponseSchema } from '@bookmark/schemas';

export const fileSchemas = {
  add: {
    tags: ['Upload'],
    summary: '文件上传',
    description: '文件上传',
    consumes: ['multipart/form-data'],
    params: uploadParamsSchema,
    response: {
      201: fileResponseSchema,
    },
  },
};
