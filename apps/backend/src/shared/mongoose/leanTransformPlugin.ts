import { Schema, Query, CallbackWithoutResultAndOptionalError } from 'mongoose';
import { recursiveTransformInPlace } from './recursive-transform.util';

/**
 * Mongoose Plugin: leanTransformPlugin
 *
 * 应用于 .lean() 查询结果，递归转换 ObjectId、Date 类型
 */
function leanTransformPlugin(schema: Schema) {
  const queryHooks: Array<string> = [
    'find',
    'findOne',
    'findById',
    'findOneAndUpdate',
    'findOneAndReplace',
    'findOneAndDelete',
    'findByIdAndUpdate',
    'findByIdAndDelete',
    // 'aggregate' // Be cautious with aggregate + lean
  ];

  queryHooks.forEach((hook) => {
    schema.post(hook as any, function (this: Query<any, any>, res: any, next: CallbackWithoutResultAndOptionalError) {
      if (res) {
        recursiveTransformInPlace(res);
      }
      next();
    });
  });
}

export default leanTransformPlugin;
