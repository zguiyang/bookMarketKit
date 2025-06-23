import type { FastifyInstance } from 'fastify';
import type { UploadFileBody } from '@bookmark/schemas';

import { FileService } from './file.service.js';
import { fileSchemas } from './file.schema.js';
import { uploadCodeMessages } from '@bookmark/code-definitions';
import { BusinessError } from '@/lib/business-error.js';

export default async function userRoutes(fastify: FastifyInstance) {
  const uploadService = new FileService(fastify);

  fastify.post<{ Params: UploadFileBody }>('/upload/:bizType', {
    schema: fileSchemas.add,
    handler: async (req) => {
      const userId = req.currentUser.id;
      const file = await req.file();
      if (!file) {
        throw new BusinessError(uploadCodeMessages.fileNotFound);
      }
      return await uploadService.uploadFile(
        userId,
        file,
        {
          bizType: req.params.bizType,
        },
        {
          allowedTypes: ['html'],
        }
      );
    },
  });
}
