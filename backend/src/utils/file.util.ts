import * as fs from 'fs/promises';
import * as fse from 'fs-extra/esm';
import * as path from 'path';
import * as mime from 'mime-types';
import { MultipartFile } from '@fastify/multipart';
import * as uploadCfg from '@/config/upload.config';

/**
 * 确保目录存在
 */
export async function ensureDir(dir: string): Promise<void> {
  await fse.ensureDir(dir);
}

/**
 * 生成文件名 (使用用户ID作为前缀)
 */
export function generateFilename(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const extension = path.extname(originalName);
  return `${timestamp}${extension}`;
}

/**
 * 获取用户文件目录
 */
export function getUserDir(userId: string): string {
  return path.join(uploadCfg.TEMP_DIR, userId);
}

/**
 * 获取文件扩展名(不带点)
 */
export function getExtension(filename: string): string {
  return path.extname(filename).substring(1).toLowerCase();
}

/**
 * 验证文件类型
 */
export function validateFileType(file: MultipartFile, allowedTypes: string[] = []): boolean {
  if (allowedTypes.length === 0) return true;

  const fileExt = getExtension(file.filename);
  return allowedTypes.includes(fileExt);
}

/**
 * 保存上传的文件
 */
export async function saveUploadedFile(
  file: MultipartFile,
  userId: string
): Promise<{
  filename: string;
  originalName: string;
  path: string;
  relativePath: string;
  size: number;
  mimeType: string;
  extension: string;
}> {
  const originalName = file.filename;
  const userDir = getUserDir(userId);

  // 确保用户目录存在
  await ensureDir(userDir);

  // 生成文件名
  const filename = generateFilename(userId, originalName);
  const filePath = path.join(userDir, filename);
  const extension = getExtension(originalName);

  // 获取文件的 buffer
  const buffer = await file.toBuffer();

  // 写入文件
  await fs.writeFile(filePath, buffer);

  // 相对路径 (用于存储到数据库)
  const relativePath = path.join('temp', userId, filename);

  return {
    filename,
    originalName,
    path: filePath, // 物理路径
    relativePath, // 相对路径
    size: buffer.length,
    mimeType: file.mimetype || mime.lookup(originalName) || 'application/octet-stream',
    extension,
  };
}

/**
 * 删除文件
 */
export async function removeFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    // 如果文件不存在，忽略错误
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * 获取文件访问URL
 */
export function getFileUrl(relativePath: string): string {
  return path.join(uploadCfg.STATIC_ROOT_DIR, relativePath);
}
