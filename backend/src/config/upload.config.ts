import * as path from 'path';

export const STATIC_DIR_NAME = 'static';

export const TEMP_DIR_NAME = 'temp';

// 文件存储根目录
export const STATIC_ROOT_DIR = path.join(process.cwd(), STATIC_DIR_NAME);

// 临时文件目录
export const TEMP_DIR = path.join(STATIC_ROOT_DIR, TEMP_DIR_NAME);

// 文件上传配置
export const UPLOAD_CONFIG = {
  // 允许的文件类型
  allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar'],

  // 最大文件大小 (5MB)
  maxFileSize: 5 * 1024 * 1024,

  // 临时文件保留时间 (24小时，单位毫秒)
  tempFileTTL: 24 * 60 * 60 * 1000,

  // @fastify/multipart 配置
  multipart: {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    attachFieldsToBody: false,
    throwFileSizeLimit: true,
  },
};
