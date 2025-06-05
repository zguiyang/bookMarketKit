import * as path from 'path';

export const STATIC_DIR_NAME = 'static';

export const TEMP_DIR_NAME = 'temp';

// Root directory for file storage
export const STATIC_ROOT_DIR = path.join(process.cwd(), STATIC_DIR_NAME);

// Temporary file directory
export const TEMP_DIR = path.join(STATIC_ROOT_DIR, TEMP_DIR_NAME);

// File upload configuration
export const UPLOAD_CONFIG = {
  // Allowed file types
  allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar'],

  // Maximum file size (5MB)
  maxFileSize: 5 * 1024 * 1024,

  // Temporary file retention time (24 hours, in milliseconds)
  tempFileTTL: 24 * 60 * 60 * 1000,

  // @fastify/multipart configuration
  multipart: {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    attachFieldsToBody: false,
    throwFileSizeLimit: true,
  },
};
