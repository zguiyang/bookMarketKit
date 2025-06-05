import normalizeUrl from 'normalize-url';

/**
 * URL normalization options interface
 */
export interface UrlNormalizeOptions {
  /** Default protocol to use when URL has no protocol (default: 'https') */
  defaultProtocol?: 'http' | 'https';

  /** Force HTTPS (default: false) */
  forceHttps?: boolean;

  /** Remove hash from URL (default: false) */
  stripHash?: boolean;

  /** Remove www prefix (default: false) */
  stripWWW?: boolean;

  /**
   * Remove query parameters
   * - true: remove all query parameters
   * - false: do not remove any query parameters
   * - Array of strings: remove specified query parameters
   * - Array of regular expressions: remove matching query parameters
   * (default: [/^utm_\w+/i])
   */
  removeQueryParameters?: boolean | readonly (string | RegExp)[];

  /** Remove trailing slash (default: false) */
  removeTrailingSlash?: boolean;
}

/**
 * Normalize URL
 *
 * Wrapped based on the normalize-url library, providing more friendly error handling and default options
 *
 * @param url Input URL or domain name
 * @param options Normalization options
 * @returns Normalized URL
 */
export function normalizeUrlSafe(url: string, options: UrlNormalizeOptions = {}): string {
  // Handle empty URL
  if (!url || typeof url !== 'string' || url.trim() === '') {
    throw new Error('URL cannot be empty');
  }

  // Remove leading/trailing whitespace
  url = url.trim();

  try {
    // Handle removeQueryParameters parameter
    let removeQueryParams = undefined;

    if (options.removeQueryParameters !== undefined) {
      // If it's a boolean, use it directly
      if (typeof options.removeQueryParameters === 'boolean') {
        removeQueryParams = options.removeQueryParameters;
      }
      // If it's an array, ensure it's readonly
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
      // Other useful default options
      normalizeProtocol: true,
      removeDirectoryIndex: true as any,
      sortQueryParameters: true,
    });
  } catch (error) {
    console.error(`Error normalizing URL "${url}":`, error);

    // Try basic fixes
    try {
      // If URL doesn't include a protocol, add the default protocol
      if (!url.includes('://')) {
        const protocol = options.defaultProtocol || 'https';
        // Handle URLs that may start with //
        if (url.startsWith('//')) {
          url = `${protocol}:${url}`;
        } else {
          url = `${protocol}://${url}`;
        }
      }

      // If forcing HTTPS, replace http:// with https://
      if (options.forceHttps && url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }

      return url;
    } catch (fallbackError) {
      // If basic fixes also fail, return the original URL
      console.error(`Fallback URL normalization failed for "${url}":`, fallbackError);
      return url;
    }
  }
}

/**
 * Check if the URL is valid
 * @param url The URL to check
 * @returns Whether the URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    // Try to parse using the URL constructor
    new URL(normalizeUrlSafe(url));
    return true;
  } catch {
    return false;
  }
}
