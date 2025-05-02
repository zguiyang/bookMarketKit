import dayjs from 'dayjs';
import { IBaseDocument } from './mongoose-type.js';

/**
 * Mongoose 文档通用转换方法
 * @param doc Mongoose文档对象
 * @param ret 转换后的普通对象
 * @returns 处理后的对象
 */
export const commonTransform = (doc:IBaseDocument, ret: Record<string, any>) => {
  // 转换 _id 为字符串
  ret._id = doc._id.toString();

  // 转换时间格式
  if (doc.createdAt) {
    ret.createdAt = dayjs(doc.createdAt).format('YYYY-MM-DD HH:mm:ss');
  }
  if (doc.updatedAt) {
    ret.updatedAt = dayjs(doc.updatedAt).format('YYYY-MM-DD HH:mm:ss');
  }
  
  return ret;
};
