import { Types } from 'mongoose';
import { isArray, isPlainObject, isDate, isNull, isUndefined } from 'lodash-es';
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * General field formatting function, supports ObjectId and Date types.
 */
export function formatFieldValue(value: any): any {
  if (value instanceof Types.ObjectId) return value.toString();
  if (isDate(value)) return dayjs(value).format(DATE_FORMAT);
  return value;
}

/**
 * Recursively transforms all fields of an object/array, uniformly formatting ObjectId and Date (returns a new object/array).
 */
export function recursiveTransform<T>(data: T): T | T[] {
  if (isNull(data) || isUndefined(data)) {
    return data;
  }
  if (isArray(data)) {
    return data.map((item) => recursiveTransform(item));
  }
  if (isPlainObject(data)) {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = recursiveTransform(data[key]);
      }
    }
    return result;
  }
  return formatFieldValue(data);
}

/**
 * Recursively transforms all fields of an object/array in place, uniformly formatting ObjectId and Date (modifies the original object/array directly).
 */
export function recursiveTransformInPlace(data: any): any {
  if (isNull(data) || isUndefined(data)) {
    return data;
  }
  if (isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = recursiveTransformInPlace(data[i]);
    }
    return data;
  }
  if (isPlainObject(data)) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = recursiveTransformInPlace(data[key]);
      }
    }
    return data;
  }
  return formatFieldValue(data);
}
