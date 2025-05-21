import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { getFileUrl } from '@/utils/file';
import Logger from '@/utils/logger';

// 简化的数据结构
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
 * 解析HTML书签文件
 * @param relativePath 文件相对路径
 * @returns 解析后的书签和分类
 */
export async function parseHtmlBookmarks(relativePath: string): Promise<{
  bookmarks: SimpleBookmark[];
  categories: SimpleCategory[];
}> {
  const fullPath = getFileUrl(relativePath);

  try {
    // 读取文件内容
    const fileContent = await fs.readFile(fullPath, 'utf-8');

    // 使用cheerio加载HTML内容
    const $ = cheerio.load(fileContent);

    const bookmarks: SimpleBookmark[] = [];
    const categories: SimpleCategory[] = [];

    // 跟踪当前路径，用于构建分类路径
    const categoryStack: string[] = [];

    // 递归解析函数
    function parseFolder(element: ReturnType<typeof $>, parentName?: string) {
      // 当前分类
      let currentCategory: SimpleCategory | null = null;

      // 遍历DT元素
      element.children('dt').each((_: any, dt: any) => {
        const dtEl = $(dt);
        const h3 = dtEl.children('h3').first();
        const a = dtEl.children('a').first();

        // 如果有H3元素，说明这是一个分类
        if (h3.length > 0) {
          const categoryName = h3.text().trim();

          // 创建分类对象
          currentCategory = {
            name: categoryName,
            parent: parentName || null,
            children: [],
          };

          // 添加到分类列表
          categories.push(currentCategory);

          // 更新分类路径
          categoryStack.push(categoryName);

          // 查找下一个DL元素（子分类和书签）
          const nextDL = dtEl.children('dl').first();
          if (nextDL.length > 0) {
            parseFolder(nextDL, categoryName);
          }

          // 回溯，移除当前分类
          categoryStack.pop();
        }
        // 如果有A元素，说明这是一个书签
        else if (a.length > 0) {
          const bookmark: SimpleBookmark = {
            title: a.text().trim(),
            url: a.attr('href') || '',
            categoryPath: [...categoryStack], // 复制当前分类路径
          };

          // 添加到书签列表
          bookmarks.push(bookmark);
        }
      });
    }

    // 查找所有的DL元素（书签文件的主要结构）
    const rootDL = $('dl').first();
    parseFolder(rootDL);

    return { bookmarks, categories };
  } catch (error: any) {
    Logger.error('解析书签文件失败:', error);
    throw new Error(`解析书签文件失败: ${error.message}`);
  }
}
