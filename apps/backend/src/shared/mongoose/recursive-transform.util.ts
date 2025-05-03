import { Types } from 'mongoose';
import { isArray, isPlainObject, isDate, isNull, isUndefined } from 'lodash-es';
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 通用字段格式化函数，支持 ObjectId、Date 类型
 */
export function formatFieldValue(value: any): any {
  if (value instanceof Types.ObjectId) return value.toString();
  if (isDate(value)) return dayjs(value).format(DATE_FORMAT);
  return value;
}

/**
 * 递归转换对象/数组的所有字段，统一格式化 ObjectId、Date（返回新对象/数组）
 */
export function recursiveTransform<T>(data: T): T | T[] {
  if (isNull(data) || isUndefined(data)) {
    return data;
  }
  if (isArray(data)) {
    return data.map(item => recursiveTransform(item));
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
 * 原地递归转换对象/数组的所有字段，统一格式化 ObjectId、Date（直接修改原对象/数组）
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