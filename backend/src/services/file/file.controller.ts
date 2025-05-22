import { FastifyRequest } from 'fastify';
import { UploadFileBody, FileResponse } from '@bookmark/schemas';
import { uploadCodeMessages } from '@bookmark/code-definitions';
import { BusinessError } from '@/lib/business-error';

import { FileService } from './file.service';

export class FileController {
  constructor(private readonly uploadService: FileService) {}

  async uploadFile(req: FastifyRequest<{ Params: UploadFileBody }>): Promise<FileResponse> {
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
