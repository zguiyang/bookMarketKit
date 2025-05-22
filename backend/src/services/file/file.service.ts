import { FastifyInstance } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import * as path from 'path';
import { FileResponse, UploadFileBody, UploadStatusEnums, FileTypeEnums } from '@bookmark/schemas';
import { uploadCodeMessages } from '@bookmark/code-definitions';
import { BusinessError } from '@/lib/business-error';
import { FileModel } from '@/models/file.model';
import * as fileUtil from '@/utils/file';
import * as uploadCfg from '@/config/upload.config';

export class FileService {
  constructor(private readonly fastify: FastifyInstance) {
    this._ensureUploadDirs();
  }

  /**
   * 确保上传目录结构存在
   */
  private async _ensureUploadDirs() {
    try {
      // 确保静态文件根目录存在
      await fileUtil.ensureDir(uploadCfg.STATIC_ROOT_DIR);

      // 确保临时文件目录存在
      await fileUtil.ensureDir(uploadCfg.TEMP_DIR);

      this.fastify.log.info(`上传目录结构: ${uploadCfg.STATIC_ROOT_DIR}`);
    } catch (error: any) {
      this.fastify.log.error(`无法创建上传目录结构: ${error.message}`);
      throw new Error(`无法创建上传目录结构: ${error.message}`);
    }
  }

  /**
   * 上传单个文件
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

    // 验证文件类型
    if (allowedTypes && !fileUtil.validateFileType(file, allowedTypes)) {
      throw new BusinessError(uploadCodeMessages.fileTypeError);
    }

    // 验证文件大小
    if (maxSize && file.file.bytesRead > maxSize) {
      throw new BusinessError(uploadCodeMessages.fileTooLarge);
    }

    // 保存文件
    const fileInfo = await fileUtil.saveUploadedFile(file, userId);

    // 保存文件记录到数据库
    const uploadRecord = await FileModel.create({
      user: userId,
      originalName: fileInfo.originalName,
      bizType,
      filename: fileInfo.filename,
      path: fileInfo.relativePath,
      size: fileInfo.size,
      mimeType: fileInfo.mimeType,
      fileType: FileTypeEnums.TEMP, // TODO: 暂时写死为临时文件
      updateStatus: UploadStatusEnums.SUCCESS,
    });

    return uploadRecord.toJSON<FileResponse>();
  }

  /**
   * 删除文件
   * @param filePath 文件路径
   * @returns 是否删除成功
   */
  async deleteFile(filePath: string): Promise<boolean> {
    const uploadItem = await FileModel.findOne({ path: filePath });
    if (!uploadItem) {
      throw new BusinessError(uploadCodeMessages.fileNotFound);
    }

    const fullPath = path.join(uploadCfg.STATIC_ROOT_DIR, uploadItem.path);
    await fileUtil.removeFile(fullPath);

    // 从数据库中删除记录
    const deleted = await FileModel.deleteOne({ _id: uploadItem._id });

    return deleted.deletedCount > 0;
  }
}
