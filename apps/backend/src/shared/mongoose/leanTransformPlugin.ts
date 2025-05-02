import mongoose, { Schema, Query, CallbackWithoutResultAndOptionalError, Types } from 'mongoose';

import { isArray, isPlainObject, isDate, isNull, isUndefined } from 'lodash-es';
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * Recursively traverses an object or array and applies transformations based on value types.
 * - Converts mongoose.Types.ObjectId to its string representation.
 * - Formats Date objects using dayjs to 'YYYY-MM-DD HH:mm:ss'.
 * - Modifies the input object/array in place.
 *
 * @param data The object, array, or primitive value to transform.
 * @returns The transformed data (though modification is done in place for objects/arrays).
 */
function transformLeanResult(data: any): any {
  // Base cases: null, undefined
  if (isNull(data) || isUndefined(data)) {
    return data;
  }

  // 1. Handle ObjectId (Mongoose specific type)
  // Important: Check instanceof before isObject, as ObjectId is technically an object
  if (data instanceof Types.ObjectId) {
    return data.toString();
  }

  // 2. Handle Date
  if (isDate(data)) {
    return dayjs(data).format(DATE_FORMAT);
  }

  // 3. Handle Arrays: Recursively transform each element
  if (isArray(data)) {
    // Modify in place
    for (let i = 0; i < data.length; i++) {
      data[i] = transformLeanResult(data[i]);
    }
    return data; // Return the modified array
  }

  // 4. Handle Plain Objects: Recursively transform each value
  // Use isPlainObject for better accuracy, excluding class instances etc.
  if (isPlainObject(data)) {
     // Modify in place
    for (const key in data) {
      // Check for own properties to avoid iterating over prototype chain
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // --- FIX HERE ---
        // Assert data as Record<string, any> to allow string indexing
        (data as Record<string, any>)[key] = transformLeanResult(data[key]);
        // --- END FIX ---
      }
    }
    return data; // Return the modified object
  }

  // 5. Return primitives or other unhandled types as is
  return data;
}


/**
 * Mongoose Plugin: leanTransformPlugin
 *
 * Applies transformations to the results of .lean() queries.
 * Specifically:
 * - Converts all `mongoose.Types.ObjectId` instances to their string representation.
 * - Formats all `Date` instances to 'YYYY-MM-DD HH:mm:ss' using dayjs.
 *
 * This transformation is applied recursively to nested objects and arrays within the result.
 *
 * @param schema The Mongoose Schema instance.
 */
function leanTransformPlugin(schema: Schema): void {

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

  queryHooks.forEach(hook => {
    // Using 'any' for hook name is often pragmatic for Mongoose plugins
    schema.post(hook as any, function(
      this: Query<any, any>,
      res: any,
      next: CallbackWithoutResultAndOptionalError
    ): void {
      const options = this.getOptions();

      if (options?.lean && res) {
          transformLeanResult(res); // Modifies res in place
      }

      next();
    });
  });
}

export default leanTransformPlugin;

