import { FastifyRequest } from 'fastify';
import { UploadAddBody, UploadResponse } from '@bookmark/schemas';
import { uploadCodeMessages } from '@bookmark/code-definitions';
import { BusinessError } from '@/core/business-error';

import { UploadService } from './upload.service';

export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  async uploadFile(req: FastifyRequest<{ Params: UploadAddBody }>): Promise<UploadResponse> {
    const userId = req.currentUser.id;
    const file = await req.file();

    if (!file) {
      throw new BusinessError(uploadCodeMessages.fileNotFound);
    }
    return await this.uploadService.uploadFile(
      userId,
      file,
      {
        bizType: req.params.bizType,
      },
      {
        allowedTypes: ['html'],
      }
    );
  }
}
