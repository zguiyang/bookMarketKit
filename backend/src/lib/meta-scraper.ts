import got from 'got';
import ogs from 'open-graph-scraper';
import type { ErrorResult, SuccessResult } from 'open-graph-scraper/types';
import { normalizeUrlSafe, isValidUrl } from '@/utils/url';
import Logger from '@/utils/logger';

/**
 * 获取网页元数据
 * @param url 网页 URL
 * @param options 配置选项
 * @returns 网页元数据
 */
export async function fetchWebsiteMetadata(url: string): Promise<SuccessResult | ErrorResult> {
  try {
    if (!isValidUrl(url)) {
      return {
        error: true,
        response: undefined,
        html: undefined,
        result: {},
      };
    }

    const normalizedUrl = normalizeUrlSafe(url);
    const ogsResult = await ogs({
      url: normalizedUrl,
    });
    // console.log('抓取结果：', JSON.stringify(ogsResult));
    return ogsResult;
  } catch (error: any) {
    Logger.error('抓取失败:', error.message);
    throw new Error(error.message ?? 'ogs failed');
  }
}

/**
 * 批量获取多个URL的元数据
 * @param urls URL数组
 * @param options 配置选项
 * @param concurrency 并发数
 */
export async function fetchMultipleMetadata(urls: string[], concurrency = 5): Promise<Record<string, SuccessResult>> {
  const results: Record<string, SuccessResult> = {};
  const uniqueUrls = [...new Set(urls)];

  for (let i = 0; i < uniqueUrls.length; i += concurrency) {
    const batch = uniqueUrls.slice(i, i + concurrency);
    const promises = batch.map((url) => fetchWebsiteMetadata(url));
    const batchResults = await Promise.all(promises.map((p) => p.catch((e) => ({ error: e.message }))));

    batch.forEach((url, index) => {
      results[url] = batchResults[index] as SuccessResult;
    });
  }

  return results;
}

/**
 * 检测URL是否可访问
 * @param url 要检测的URL
 * @param timeout 超时时间（毫秒）
 * @returns 是否可访问
 */
export async function isUrlAccessible(url: string, timeout = 5000): Promise<boolean> {
  try {
    const normalizedUrl = normalizeUrlSafe(url);

    const response = await got.head(normalizedUrl, {
      timeout: { request: timeout },
      followRedirect: true,
      throwHttpErrors: false,
    });

    return response.statusCode >= 200 && response.statusCode < 400;
  } catch {
    return false;
  }
}
