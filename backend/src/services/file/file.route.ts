import type { FastifyInstance } from 'fastify';
import type { UploadFileBody } from '@bookmark/schemas';

import { FileController } from './file.controller';
import { FileService } from './file.service';
import { fileSchemas } from './file.schema';

export default async function userRoutes(fastify: FastifyInstance) {
  const uploadService = new FileService(fastify);
  const uploadController = new FileController(uploadService);

  fastify.post<{ Params: UploadFileBody }>('/upload/:bizType', {
    schema: fileSchemas.add,
    handler: (req) => uploadController.uploadFile(req),
  });
}
