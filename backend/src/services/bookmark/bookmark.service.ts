import { omit } from 'lodash-es';
import { Types, FilterQuery } from 'mongoose';
import escapeStringRegexp from 'escape-string-regexp';
import {
  BookmarkResponse,
  BookmarkListResponse,
  BookmarkPageListResponse,
  BookmarkCollectionResponse,
  CreateBookmarkBody,
  UpdateBookmarkBody,
  SetFavoriteBody,
  SetPinnedBody,
  BookmarkPageListQuery,
  BookmarkPinnedEnum,
  BookmarkSearchResponse,
  BookmarkImportBody,
  BookmarkImportResponse,
} from '@bookmark/schemas';
import { QueueConfig } from '@/config/constant.config';
import { BookmarkModel, IBookmarkDocument, IBookmarkLean } from '@/models/bookmark';
import { BusinessError } from '@/lib/business-error';
import { bookmarkCodeMessages } from '@bookmark/code-definitions';
import { getPaginateOptions } from '@/utils/query-params';
import { isValidUrl } from '@/utils/url';
import { parseHtmlBookmarks } from '@/lib/bookmark-parser';
import QueueLib from '@/lib/queue';
import { TagService } from './tag/tag.service';
import { CategoryService } from './category/category.service';
import { WebsiteMetaService } from '@/services/website/website-meta.service';
import { BookmarkFetchTask } from '@/interfaces/queue.interface';

export class BookmarkService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly websiteMetaService: WebsiteMetaService
  ) {}

  async create(userId: string, data: CreateBookmarkBody): Promise<BookmarkResponse> {
    const exists = await BookmarkModel.exists({
      $or: [
        {
          url: data.url,
        },
      ],
      user: userId,
    });
    if (exists) {
      throw new BusinessError(bookmarkCodeMessages.existed);
    }

    if (!isValidUrl(data.url)) {
      throw new BusinessError(bookmarkCodeMessages.createErrorWithUrl);
    }

    const bookmark = await BookmarkModel.create({
      ...data,
      user: userId,
      categories: data.categoryIds || [],
      tags: data.tagIds || [],
    });

    const newMeta = await this.websiteMetaService.create({
      url: data.url,
      bookmarkId: bookmark._id.toString(),
    });

    await QueueLib.addTask<BookmarkFetchTask>(
      QueueConfig.bookmark.fetchMeta,
      {
        bookmarkId: bookmark._id.toString(),
        metaId: newMeta._id.toString(),
        url: data.url,
        userId,
      },
      60 * 60 * 12 // 12 hours expire
    );

    return bookmark.toJSON<BookmarkResponse>();
  }

  async update(userId: string, data: UpdateBookmarkBody): Promise<BookmarkResponse> {
    const updateData = {
      ...omit(data, ['id', 'categoryIds', 'tagIds']),
      ...(data.categoryIds && { categories: data.categoryIds }),
      ...(data.tagIds && { tags: data.tagIds }),
    };

    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: data.id, user: userId },
      { $set: updateData },
      { new: true }
    )
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.updateError);
    }

    return bookmark;
  }

  async delete(userId: string, id: string) {
    return await BookmarkModel.deleteOne({ _id: id, user: userId });
  }

  async favorite(userId: string, data: SetFavoriteBody): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: data.id, user: userId },
      { isFavorite: data.favorite },
      { new: true }
    )
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.notFound);
    }

    return bookmark;
  }

  async pinned(userId: string, data: SetPinnedBody): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: data.id, user: userId },
      { isPinned: data.pinned },
      { new: true }
    )
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.notFound);
    }

    return bookmark;
  }

  async findAll(userId: string): Promise<BookmarkListResponse> {
    const bookmarks = await BookmarkModel.find({ user: userId })
      .populate(['categories', 'tags'])
      .sort({ createdAt: -1 })
      .lean<IBookmarkLean[]>();
    return bookmarks;
  }

  async findOne(userId: string, id: string): Promise<BookmarkResponse | null> {
    const bookmark = await BookmarkModel.findOne({ _id: id, user: userId })
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();
    return bookmark;
  }

  async findByFields(userId: string, query: FilterQuery<IBookmarkDocument>): Promise<BookmarkResponse | null> {
    const bookmark = await BookmarkModel.findOne(query).lean<IBookmarkLean>();
    return bookmark;
  }

  async pageList(userId: string, query: BookmarkPageListQuery): Promise<BookmarkPageListResponse> {
    const { isPinned, isFavorite, keyword, tagId, categoryId } = query;

    const filter: any = { user: userId };

    // 构建查询条件
    if (isPinned !== undefined) {
      filter.isPinned = isPinned;
    }
    if (isFavorite !== undefined) {
      filter.isFavorite = isFavorite;
    }
    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' };
    }
    if (categoryId) {
      filter.categories = new Types.ObjectId(categoryId);
    }
    if (tagId) {
      filter.tags = new Types.ObjectId(tagId);
    }

    const { page, pageSize, skip, sort } = getPaginateOptions(query);

    // 查询总数
    const total = await BookmarkModel.countDocuments(filter);
    // 查询分页内容
    const bookmarks = await BookmarkModel.find(filter)
      .populate(['categories', 'tags'])
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .lean<IBookmarkLean[]>();

    const pages = Math.ceil(total / pageSize);

    return {
      page,
      pageSize,
      pages,
      content: bookmarks,
      total,
    };
  }

  async findCollection(userId: string): Promise<BookmarkCollectionResponse> {
    const [pinnedBookmarks, recentBookmarks, recentAddedBookmarks] = await Promise.all([
      // 置顶书签
      BookmarkModel.find({ user: userId, isPinned: BookmarkPinnedEnum.YES })
        .populate(['categories', 'tags'])
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean<IBookmarkLean[]>(),

      // 最近访问的书签
      BookmarkModel.find({ user: userId, lastVisitedAt: { $exists: true } })
        .populate(['categories', 'tags'])
        .sort({ lastVisitedAt: -1 })
        .limit(10)
        .lean<IBookmarkLean[]>(),

      // 最近添加的书签
      BookmarkModel.find({ user: userId })
        .populate(['categories', 'tags'])
        .sort({ createdAt: -1 })
        .limit(10)
        .lean<IBookmarkLean[]>(),
    ]);

    return {
      pinnedBookmarks,
      recentBookmarks,
      recentAddedBookmarks,
    };
  }

  async updateLastVisitTime(userId: string, id: string): Promise<BookmarkResponse> {
    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: id, user: userId },
      {
        lastVisitedAt: new Date(),
        $inc: { visitCount: 1 },
      },
      { new: true }
    )
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean>();

    if (!bookmark) {
      throw new BusinessError(bookmarkCodeMessages.notFound);
    }

    return bookmark;
  }

  async search(userId: string, keyword?: string): Promise<BookmarkSearchResponse> {
    if (!keyword) {
      return {
        bookmarks: [],
        categories: [],
        tags: [],
      };
    }
    const query: FilterQuery<IBookmarkDocument> = { user: userId };
    const keywordRegex = escapeStringRegexp(keyword.trim());
    query.$or = [{ title: { $regex: keywordRegex, $options: 'i' } }, { url: { $regex: keywordRegex, $options: 'i' } }];
    const bookmarks = await BookmarkModel.find(query)
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean[]>()
      .limit(50);

    const categories = await this.categoryService.search(userId, keyword);
    const tags = await this.tagService.search(userId, keyword);

    return {
      bookmarks,
      categories,
      tags,
    };
  }

  async import(userId: string, data: BookmarkImportBody): Promise<BookmarkImportResponse> {
    const { bookmarks, categories } = await parseHtmlBookmarks(data.filePath);

    // 导入结果统计
    const result = {
      totalCategories: categories.length,
      totalBookmarks: bookmarks.length,
      importedCategories: 0,
      importedBookmarks: 0,
      errors: [] as string[],
    };

    const categoryNameToIdMap = new Map<string, string>();

    const sortedCategories = [...categories].sort((a, b) => {
      if (!a.parent) return -1;
      if (!b.parent) return 1;
      return 0;
    });

    // 创建分类
    for (const category of sortedCategories) {
      const exists = await this.categoryService.findByFields(userId, {
        name: category.name,
      });
      if (exists) {
        categoryNameToIdMap.set(category.name, exists._id);
        continue;
      }

      try {
        let parentId = null;
        if (category.parent && categoryNameToIdMap.has(category.parent)) {
          parentId = categoryNameToIdMap.get(category.parent) || null;
        }

        const createdCategory = await this.categoryService.create(userId, {
          name: category.name,
          parent: parentId,
        });

        categoryNameToIdMap.set(category.name, createdCategory._id);

        result.importedCategories++;
      } catch (error: any) {
        result.errors.push(`导入分类 "${category.name}" 失败: ${error.message}`);
      }
    }

    for (const bookmark of bookmarks) {
      const { title, url } = bookmark;
      const existingBookmark = await this.findByFields(userId, {
        $or: [{ title }, { url }],
      });
      if (existingBookmark) {
        continue;
      }
      try {
        const categoryIds: string[] = [];
        if (bookmark.categoryPath.length > 0) {
          const categoryName = bookmark.categoryPath[bookmark.categoryPath.length - 1];
          if (categoryNameToIdMap.has(categoryName)) {
            const categoryId = categoryNameToIdMap.get(categoryName);
            if (categoryId) {
              categoryIds.push(categoryId);
            }
          }
        }

        await this.create(userId, {
          title: bookmark.title || bookmark.url,
          url: bookmark.url,
          icon: `${bookmark.url}/favicon.ico`,
          categoryIds,
          tagIds: [],
        });

        result.importedBookmarks++;
      } catch (error: any) {
        result.errors.push(`导入书签 "${bookmark.title}, ${bookmark.url}" 失败: ${error.message}`);
      }
    }

    return result;
  }

  async _generateHtmlBookmarks(bookmarks: IBookmarkLean[]) {
    // 创建 HTML 文档头部 - 符合 Netscape 书签文件格式
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

    // 按照分类组织书签
    const categoryMap: {
      [key: string]: IBookmarkLean[];
    } = {};
    const noFolderBookmarks: IBookmarkLean[] = [];

    /**
     * 转义 HTML 特殊字符，防止 HTML 注入
     * @param {string} text - 需要转义的文本
     * @returns {string} - 转义后的文本
     */
    function escapeHtml(text: string) {
      if (!text) return '';

      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // 将书签按分类分组
    bookmarks.forEach((bookmark) => {
      if (bookmark.categories && bookmark.categories.length > 0) {
        // 使用第一个分类作为文件夹（如果有多个分类）
        const category = bookmark.categories[0].name;
        if (!categoryMap[category]) {
          categoryMap[category] = [];
        }
        categoryMap[category].push(bookmark);
      } else {
        // 没有分类的书签单独处理
        noFolderBookmarks.push(bookmark);
      }
    });

    // 先添加没有分类的书签
    if (noFolderBookmarks.length > 0) {
      html += `    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">未分类</H3>\n`;
      html += `    <DL><p>\n`;

      noFolderBookmarks.forEach((bookmark) => {
        // 解析创建时间字符串为时间戳
        const createdAt = bookmark.createdAt
          ? new Date(bookmark.createdAt).getTime() / 1000
          : Math.floor(Date.now() / 1000);

        // 转义特殊字符，防止 HTML 注入
        const safeTitle = escapeHtml(bookmark.title || 'Untitled');
        const safeUrl = escapeHtml(bookmark.url);

        html += `        <DT><A HREF="${safeUrl}" ADD_DATE="${Math.floor(createdAt)}">${safeTitle}</A>\n`;

        // 如果有描述，添加描述
        if (bookmark.description) {
          html += `        <DD>${escapeHtml(bookmark.description)}\n`;
        }
      });

      html += `    </DL><p>\n`;
    }

    // 为每个分类生成 HTML
    Object.keys(categoryMap).forEach((category) => {
      const folderDate = Math.floor(Date.now() / 1000);
      const safeCategoryName = escapeHtml(category);

      // 添加分类文件夹
      html += `    <DT><H3 ADD_DATE="${folderDate}" LAST_MODIFIED="${folderDate}">${safeCategoryName}</H3>\n`;
      html += `    <DL><p>\n`;

      // 添加该分类中的书签
      categoryMap[category].forEach((bookmark) => {
        // 解析创建时间字符串为时间戳
        const createdAt = bookmark.createdAt
          ? new Date(bookmark.createdAt).getTime() / 1000
          : Math.floor(Date.now() / 1000);

        // 转义特殊字符
        const safeTitle = escapeHtml(bookmark.title || 'Untitled');
        const safeUrl = escapeHtml(bookmark.url);

        html += `        <DT><A HREF="${safeUrl}" ADD_DATE="${Math.floor(createdAt)}"`;

        // 添加图标（如果有）
        if (bookmark.icon && !bookmark.icon.startsWith('data:')) {
          html += ` ICON="${escapeHtml(bookmark.icon)}"`;
        }

        html += `>${safeTitle}</A>\n`;

        // 如果有描述，添加描述
        if (bookmark.description) {
          html += `        <DD>${escapeHtml(bookmark.description)}\n`;
        }
      });

      // 关闭分类文件夹标签
      html += `    </DL><p>\n`;
    });

    // 关闭 HTML 文档
    html += `</DL><p>`;

    return html;
  }
  async export(userId: string) {
    const bookmarks = await BookmarkModel.find({ user: userId })
      .populate(['categories', 'tags'])
      .lean<IBookmarkLean[]>();

    const exportHtml = await this._generateHtmlBookmarks(bookmarks);

    return exportHtml;
  }
}
