/**
 * 过滤对象中的无效值（null、undefined、空字符串）
 * @param params 需要过滤的对象
 * @returns 过滤后的对象（只包含有效值）
 */
export function filterNullOrUndefined<T extends Record<string, any>>(
  params: T,
): Partial<T> {
  if (!params || typeof params !== 'object') {
    return {};
  }

  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * 示例用法：
 *
 * const params = {
 *   name: 'test',
 *   age: null,
 *   email: undefined,
 *   address: '',      // 会保留
 *   count: 0,        // 会保留
 *   tags: [],        // 会保留
 *   meta: {}         // 会保留
 * };
 *
 * const filteredParams = filterNullOrUndefined(params);
 * // 结果: { name: 'test', address: '', count: 0, tags: [], meta: {} }
 */
