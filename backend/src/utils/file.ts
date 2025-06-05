import * as fs from 'fs/promises';
import * as fse from 'fs-extra/esm';
import * as path from 'path';
import * as mime from 'mime-types';
import { MultipartFile } from '@fastify/multipart';
import * as uploadCfg from '@/config/upload.config';

/**
 * Ensure directory exists
 */
export async function ensureDir(dir: string): Promise<void> {
  await fse.ensureDir(dir);
}

/**
 * Generate filename (using user ID as prefix)
 */
export function generateFilename(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const extension = path.extname(originalName);
  return `${timestamp}${extension}`;
}

/**
 * Get user file directory
 */
export function getUserDir(userId: string): string {
  return path.join(uploadCfg.TEMP_DIR, userId);
}

/**
 * Get file extension (without dot)
 */
export function getExtension(filename: string): string {
  return path.extname(filename).substring(1).toLowerCase();
}

/**
 * Validate file type
 */
export function validateFileType(file: MultipartFile, allowedTypes: string[] = []): boolean {
  if (allowedTypes.length === 0) return true;

  const fileExt = getExtension(file.filename);
  return allowedTypes.includes(fileExt);
}

/**
 * Save uploaded file
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

  // Ensure user directory exists
  await ensureDir(userDir);

  // Generate filename
  const filename = generateFilename(userId, originalName);
  const filePath = path.join(userDir, filename);
  const extension = getExtension(originalName);

  // Get file buffer
  const buffer = await file.toBuffer();

  // Write file
  await fs.writeFile(filePath, buffer);

  // Relative path (for storing in the database)
  const relativePath = path.join('temp', userId, filename);

  return {
    filename,
    originalName,
    path: filePath, // Physical path
    relativePath, // Relative path
    size: buffer.length,
    mimeType: file.mimetype || mime.lookup(originalName) || 'application/octet-stream',
    extension,
  };
}

/**
 * Remove file
 */
export async function removeFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    // If the file does not exist, ignore the error
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Get file access URL
 */
export function getFileUrl(relativePath: string): string {
  return path.join(uploadCfg.STATIC_ROOT_DIR, relativePath);
}
