import { IBaseDocument } from './mongoose-type';
import { recursiveTransform } from './recursive-transform.util';

/**
 * Common Mongoose document transformation method.
 * @param doc Mongoose document object.
 * @param ret Transformed plain object.
 * @returns Processed object.
 */
export const commonTransform = (_: IBaseDocument, ret: Record<string, any>) => {
  return recursiveTransform(ret);
};
