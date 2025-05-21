import normalizeUrl from 'normalize-url';

/**
 * URL 规范化选项接口
 */
export interface UrlNormalizeOptions {
  /** 默认协议，当URL没有指定协议时使用 (默认: 'https') */
  defaultProtocol?: 'http' | 'https';

  /** 强制使用HTTPS (默认: false) */
  forceHttps?: boolean;

  /** 移除URL中的哈希部分 (默认: false) */
  stripHash?: boolean;

  /** 移除www前缀 (默认: false) */
  stripWWW?: boolean;

  /**
   * 移除查询参数
   * - true: 移除所有查询参数
   * - false: 不移除任何查询参数
   * - 字符串数组: 移除指定的查询参数
   * - 正则表达式数组: 移除匹配的查询参数
   * (默认: [/^utm_\w+/i])
   */
  removeQueryParameters?: boolean | readonly (string | RegExp)[];

  /** 移除尾部斜杠 (默认: false) */
  removeTrailingSlash?: boolean;
}

/**
 * 规范化 URL
 *
 * 基于 normalize-url 库封装，提供更友好的错误处理和默认选项
 *
 * @param url 输入的 URL 或域名
 * @param options 规范化选项
 * @returns 规范化后的 URL
 */
export function normalizeUrlSafe(url: string, options: UrlNormalizeOptions = {}): string {
  // 处理空URL
  if (!url || typeof url !== 'string' || url.trim() === '') {
    throw new Error('URL cannot be empty');
  }

  // 移除前后空白
  url = url.trim();

  try {
    // 处理 removeQueryParameters 参数
    let removeQueryParams = undefined;

    if (options.removeQueryParameters !== undefined) {
      // 如果是布尔值，直接使用
      if (typeof options.removeQueryParameters === 'boolean') {
        removeQueryParams = options.removeQueryParameters;
      }
      // 如果是数组，确保它是只读的
      else if (Array.isArray(options.removeQueryParameters)) {
        removeQueryParams = [...options.removeQueryParameters];
      }
    }

    return normalizeUrl(url, {
      defaultProtocol: options.defaultProtocol || 'https',
      forceHttps: options.forceHttps || false,
      stripHash: options.stripHash || false,
      stripWWW: options.stripWWW || false,
      removeQueryParameters: removeQueryParams as any,
      removeTrailingSlash: options.removeTrailingSlash || false,
      // 其他有用的默认选项
      normalizeProtocol: true,
      removeDirectoryIndex: true as any,
      sortQueryParameters: true,
    });
  } catch (error) {
    console.error(`Error normalizing URL "${url}":`, error);

    // 尝试基本修复
    try {
      // 如果URL不包含协议，添加默认协议
      if (!url.includes('://')) {
        const protocol = options.defaultProtocol || 'https';
        // 处理可能以 // 开头的URL
        if (url.startsWith('//')) {
          url = `${protocol}:${url}`;
        } else {
          url = `${protocol}://${url}`;
        }
      }

      // 如果强制使用HTTPS，替换http://为https://
      if (options.forceHttps && url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }

      return url;
    } catch (fallbackError) {
      // 如果基本修复也失败，返回原始URL
      console.error(`Fallback URL normalization failed for "${url}":`, fallbackError);
      return url;
    }
  }
}

/**
 * 检查URL是否有效
 * @param url 要检查的URL
 * @returns 是否为有效URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    // 尝试使用URL构造函数解析
    new URL(normalizeUrlSafe(url));
    return true;
  } catch {
    return false;
  }
}
