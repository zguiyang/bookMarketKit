import type { FastifyInstance } from 'fastify';
import type { UploadAddBody } from '@bookmark/schemas';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { uploadSchemas } from './upload.schema';

export default async function userRoutes(fastify: FastifyInstance) {
  const uploadService = new UploadService(fastify);
  const uploadController = new UploadController(uploadService);

  fastify.post<{ Params: UploadAddBody }>('/:bizType', {
    schema: uploadSchemas.add,
    handler: (req) => uploadController.uploadFile(req),
  });
}
