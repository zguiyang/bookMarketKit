import got from 'got';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperLogo from 'metascraper-logo-favicon';
import metascraperUrl from 'metascraper-url';
import metascraperAuthor from 'metascraper-author';
import metascraperDate from 'metascraper-date';
import metascraperLang from 'metascraper-lang';
import metascraperPublisher from 'metascraper-publisher';
import metascraperAudio from 'metascraper-audio';
import metascraperVideo from 'metascraper-video';

// 导入我们的URL工具
import { normalizeUrlSafe, isValidUrl, UrlNormalizeOptions } from '@/utils/url';

/**
 * 网页元数据接口
 */
export interface WebsiteMetadata {
  // 基础元数据
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  url?: string;

  // 扩展元数据
  author?: string;
  date?: string;
  lang?: string;
  publisher?: string;
  audio?: string;
  video?: string;

  // 性能指标
  fetchTime?: number; // 获取HTML的时间(ms)
  parseTime?: number; // 解析元数据的时间(ms)

  // 错误信息
  error?: string; // 如果发生错误，这里会有错误信息
}

/**
 * 抓取选项接口
 */
export interface ScraperOptions {
  // 请求选项
  timeout?: number;
  userAgent?: string;
  retries?: number;
  headers?: Record<string, string>;
  proxy?: string;

  // 规则选项
  rules?: string[]; // 要使用的规则名称

  // URL规范化选项
  urlOptions?: UrlNormalizeOptions;
}

// 创建规则映射
const rulesMap = {
  title: metascraperTitle(),
  description: metascraperDescription(),
  image: metascraperImage(),
  logo: metascraperLogo(),
  url: metascraperUrl(),
  author: metascraperAuthor(),
  date: metascraperDate(),
  lang: metascraperLang(),
  publisher: metascraperPublisher(),
  audio: metascraperAudio(),
  video: metascraperVideo(),
};

// 默认规则
const defaultRules = ['title', 'description', 'image', 'logo', 'url'];

/**
 * 获取网页元数据
 * @param url 网页 URL 或域名
 * @param options 配置选项
 * @returns 网页元数据
 */
export async function fetchWebsiteMetadata(url: string, options: ScraperOptions = {}): Promise<WebsiteMetadata> {
  // 默认选项
  const {
    timeout = 10000,
    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    retries = 2,
    headers = {},
    proxy,
    rules = defaultRules,
    urlOptions = {
      defaultProtocol: 'https',
      forceHttps: false,
      // 使用默认的 UTM 参数移除
      removeQueryParameters: [/^utm_\w+/i],
    },
  } = options;

  // 初始化结果对象
  const result: WebsiteMetadata = {};

  try {
    // 验证URL不为空
    if (!url || url.trim() === '') {
      throw new Error('URL cannot be empty');
    }

    // 使用我们的URL工具规范化URL
    const normalizedUrl = normalizeUrlSafe(url, urlOptions);

    // 验证URL是否有效
    if (!isValidUrl(normalizedUrl)) {
      throw new Error(`Invalid URL: ${url}`);
    }

    // 记录开始时间
    const fetchStartTime = Date.now();

    // 构建请求选项
    const gotOptions: any = {
      timeout: { request: timeout },
      headers: {
        'user-agent': userAgent,
        ...headers,
      },
      retry: { limit: retries },
      followRedirect: true,
      throwHttpErrors: false, // 不自动抛出HTTP错误
    };

    // 添加代理配置
    if (proxy) {
      gotOptions.proxy = proxy;
    }

    // 发送请求获取 HTML
    const response = await got(normalizedUrl, gotOptions);

    // 记录请求完成时间
    const fetchEndTime = Date.now();
    result.fetchTime = fetchEndTime - fetchStartTime;

    // 处理HTTP错误
    if (response.statusCode >= 400) {
      throw new Error(`HTTP error: ${response.statusCode}`);
    }

    const html = response.body;
    const finalUrl = response.url;

    // 记录解析开始时间
    const parseStartTime = Date.now();

    // 构建规则集
    const activeRules = rules
      .map((rule) => {
        if (rulesMap[rule as keyof typeof rulesMap]) {
          return rulesMap[rule as keyof typeof rulesMap];
        }
        return null;
      })
      .filter(Boolean);

    // 使用 metascraper 提取元数据
    const scraper = metascraper(activeRules as any[]);
    const metadata = await scraper({ html, url: finalUrl });

    // 记录解析完成时间
    const parseEndTime = Date.now();
    result.parseTime = parseEndTime - parseStartTime;

    // 合并元数据到结果
    Object.assign(result, metadata);

    return result;
  } catch (error: any) {
    // 处理错误
    let errorMessage = 'Unknown error occurred';

    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      errorMessage = `Request timed out after ${timeout}ms`;
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = `Domain not found: ${url}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error(`Error fetching metadata for ${url}:`, errorMessage);

    return {
      ...result,
      error: errorMessage,
    };
  }
}

/**
 * 批量获取多个URL的元数据
 * @param urls URL数组
 * @param options 配置选项
 * @param concurrency 并发数
 */
export async function fetchMultipleMetadata(
  urls: string[],
  options: ScraperOptions = {},
  concurrency = 5
): Promise<Record<string, WebsiteMetadata>> {
  const results: Record<string, WebsiteMetadata> = {};
  const uniqueUrls = [...new Set(urls)]; // 去重

  // 使用分批处理控制并发
  for (let i = 0; i < uniqueUrls.length; i += concurrency) {
    const batch = uniqueUrls.slice(i, i + concurrency);
    const promises = batch.map((url) => fetchWebsiteMetadata(url, options));

    const batchResults = await Promise.all(promises);

    batch.forEach((url, index) => {
      // 使用规范化的URL作为键
      const normalizedUrl = normalizeUrlSafe(url, options.urlOptions);
      results[normalizedUrl] = batchResults[index];
    });
  }

  return results;
}

/**
 * 获取单个URL的基本元数据（简化版）
 * 适用于只需要基本信息的场景
 *
 * @param url 网页URL
 * @returns 基本元数据（标题、描述、图片）
 */
export async function getBasicMetadata(
  url: string
): Promise<Pick<WebsiteMetadata, 'title' | 'description' | 'image' | 'error'>> {
  try {
    const metadata = await fetchWebsiteMetadata(url, {
      rules: ['title', 'description', 'image'],
      urlOptions: {
        defaultProtocol: 'https',
        forceHttps: true,
        removeQueryParameters: [/^utm_\w+/i, 'ref', 'source'],
      },
    });

    return {
      title: metadata.title,
      description: metadata.description,
      image: metadata.image,
      error: metadata.error,
    };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to fetch basic metadata',
    };
  }
}

/**
 * 从URL获取网站LOGO
 * @param url 网站URL
 * @returns LOGO URL
 */
export async function getWebsiteLogo(url: string): Promise<string | null> {
  try {
    const metadata = await fetchWebsiteMetadata(url, {
      rules: ['logo'],
      urlOptions: {
        defaultProtocol: 'https',
        forceHttps: true,
      },
    });

    return metadata.logo || null;
  } catch (error) {
    console.error(`Failed to get logo for ${url}:`, error);
    return null;
  }
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
