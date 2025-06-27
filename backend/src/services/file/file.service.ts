import type { FastifyInstance } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';
import * as path from 'path';
import type { FileResponse, UploadFileBody } from '~shared/schemas';
import { UploadStatusEnums, StorageTypeEnums } from '~shared/schemas';
import { uploadCodeMessages } from '~shared/code-definitions';
import { BusinessError } from '@/lib/business-error.js';
import { FileModel } from '@/models/file.model.js';
import * as fileUtil from '@/utils/file.js';
import * as uploadCfg from '@/config/upload.config.js';

export class FileService {
  constructor(private readonly fastify: FastifyInstance) {
    this._ensureUploadDirs();
  }

  /**
   * Ensures that the upload directory structure exists.
   */
  private async _ensureUploadDirs() {
    try {
      // Ensure the static file root directory exists.
      await fileUtil.ensureDir(uploadCfg.STATIC_ROOT_DIR);

      // Ensure the temporary file directory exists.
      await fileUtil.ensureDir(uploadCfg.TEMP_DIR);

      this.fastify.log.info(`Upload directory structure: ${uploadCfg.STATIC_ROOT_DIR}`);
    } catch (error: any) {
      this.fastify.log.error(`Failed to create upload directory structure: ${error.message}`);
      throw new Error(`Failed to create upload directory structure: ${error.message}`);
    }
  }

  /**
   * Uploads a single file.
   */
  async uploadFile(
    userId: string,
    file: MultipartFile,
    data: UploadFileBody,
    options: {
      allowedTypes?: string[];
      maxSize?: number;
    } = {}
  ): Promise<FileResponse> {
    const { bizType } = data;
    const { allowedTypes = uploadCfg.UPLOAD_CONFIG.allowedTypes, maxSize = uploadCfg.UPLOAD_CONFIG.maxFileSize } =
      options;

    // Validate file type.
    if (allowedTypes && !fileUtil.validateFileType(file, allowedTypes)) {
      throw new BusinessError(uploadCodeMessages.fileTypeError);
    }

    // Validate file size.
    if (maxSize && file.file.bytesRead > maxSize) {
      throw new BusinessError(uploadCodeMessages.fileTooLarge);
    }

    // Save the file.
    const fileInfo = await fileUtil.saveUploadedFile(file, userId);

    // Save file record to the database.
    const uploadRecord = await FileModel.create({
      user: userId,
      originalName: fileInfo.originalName,
      bizType,
      filename: fileInfo.filename,
      path: fileInfo.relativePath,
      size: fileInfo.size,
      mimeType: fileInfo.mimeType,
      storageType: StorageTypeEnums.TEMP, // TODO: Temporarily hardcoded as a temporary file.
      updateStatus: UploadStatusEnums.SUCCESS,
    });

    return uploadRecord.toJSON<FileResponse>();
  }

  /**
   * Deletes a file.
   * @param filePath The file path.
   * @returns Whether the deletion was successful.
   */
  async deleteFile(filePath: string): Promise<boolean> {
    const uploadItem = await FileModel.findOne({ path: filePath });
    if (!uploadItem) {
      throw new BusinessError(uploadCodeMessages.fileNotFound);
    }

    const fullPath = path.join(uploadCfg.STATIC_ROOT_DIR, uploadItem.path);
    await fileUtil.removeFile(fullPath);

    // Delete the record from the database.
    const deleted = await FileModel.deleteOne({ _id: uploadItem._id });

    return deleted.deletedCount > 0;
  }
}
