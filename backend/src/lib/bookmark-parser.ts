import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { getFileUrl } from '@/utils/file.js';
import Logger from '@/utils/logger.js';

// Simplified data structures
interface SimpleBookmark {
  title: string;
  url: string;
  categoryPath: string[];
}

interface SimpleCategory {
  name: string;
  parent: string | null;
  children: SimpleCategory[];
}

/**
 * Parse HTML bookmark file
 * @param relativePath Relative file path
 * @returns Parsed bookmarks and categories
 */
export async function parseHtmlBookmarks(relativePath: string): Promise<{
  bookmarks: SimpleBookmark[];
  categories: SimpleCategory[];
}> {
  const fullPath = getFileUrl(relativePath);

  try {
    // Read file content
    const fileContent = await fs.readFile(fullPath, 'utf-8');

    // Load HTML content using cheerio
    const $ = cheerio.load(fileContent);

    const bookmarks: SimpleBookmark[] = [];
    const categories: SimpleCategory[] = [];

    // Track current path for building category hierarchy
    const categoryStack: string[] = [];

    // Recursive parsing function
    function parseFolder(element: ReturnType<typeof $>, parentName?: string) {
      // Current category
      let currentCategory: SimpleCategory | null = null;

      // Traverse DT elements
      element.children('dt').each((_: any, dt: any) => {
        const dtEl = $(dt);
        const h3 = dtEl.children('h3').first();
        const a = dtEl.children('a').first();

        // If H3 element exists, this is a category
        if (h3.length > 0) {
          const categoryName = h3.text().trim();

          // Create category object
          currentCategory = {
            name: categoryName,
            parent: parentName || null,
            children: [],
          };

          // Add to categories list
          categories.push(currentCategory);

          // Update category path
          categoryStack.push(categoryName);

          // Find next DL element (subcategories and bookmarks)
          const nextDL = dtEl.children('dl').first();
          if (nextDL.length > 0) {
            parseFolder(nextDL, categoryName);
          }

          // Backtrack, remove current category
          categoryStack.pop();
        }
        // If A element exists, this is a bookmark
        else if (a.length > 0) {
          const bookmark: SimpleBookmark = {
            title: a.text().trim(),
            url: a.attr('href') || '',
            categoryPath: [...categoryStack], // Copy current category path
          };

          // Add to bookmarks list
          bookmarks.push(bookmark);
        }
      });
    }

    // Find all DL elements (main structure of bookmark file)
    const rootDL = $('dl').first();
    parseFolder(rootDL);

    return { bookmarks, categories };
  } catch (error: any) {
    Logger.error('Failed to parse bookmark file:', error);
    throw new Error(`Failed to parse bookmark file: ${error.message}`);
  }
}
