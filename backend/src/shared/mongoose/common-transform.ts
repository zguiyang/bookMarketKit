import { IBaseDocument } from './mongoose-type';
import { recursiveTransform } from './recursive-transform.util';

/**
 * Mongoose 文档通用转换方法
 * @param doc Mongoose文档对象
 * @param ret 转换后的普通对象
 * @returns 处理后的对象
 */
export const commonTransform = (_: IBaseDocument, ret: Record<string, any>) => {
  return recursiveTransform(ret);
};
