import { uploadParamsSchema, fileResponseSchema } from '~shared/schemas';

export const fileSchemas = {
  add: {
    tags: ['Upload'],
    summary: 'File Upload',
    description: 'File Upload',
    consumes: ['multipart/form-data'],
    params: uploadParamsSchema,
    response: {
      201: fileResponseSchema,
    },
  },
};
