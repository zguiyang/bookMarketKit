import { omit } from 'lodash-es';
import { Types, type FilterQuery } from 'mongoose';
import escapeStringRegexp from 'escape-string-regexp';
import type {
  BookmarkResponse,
  BookmarkListResponse,
  BookmarkPageListResponse,
  BookmarkCollectionResponse,
  CreateBookmarkBody,
  UpdateBookmarkBody,
  SetFavoriteBody,
  SetPinnedBody,
  BookmarkPageListQuery,
  BookmarkSearchResponse,
  BookmarkImportBody,
  BookmarkImportResponse,
} from '~shared/schemas';
import {  BookmarkPinnedEnum } from '~shared/schemas/bookmark'
import { QueueConfig } from '@/config/constant.config.js';
import { BookmarkModel } from '@/models/bookmark/index.js';
import type { IBookmarkDocument, IBookmarkLean } from '@/models/bookmark/index.js';
import { BusinessError } from '@/lib/business-error.js';
import { bookmarkCodeMessages } from '~shared/code-definitions';
import { getPaginateOptions } from '@/utils/query-params.js';
import { isValidUrl } from '@/utils/url.js';
import { parseHtmlBookmarks } from '@/lib/bookmark-parser.js';
import QueueLib from '@/lib/queue.js';
import { TagService } from './tag/tag.service.js';
import { CategoryService } from './category/category.service.js';
import { WebsiteMetaService } from '@/services/website/website-meta.service.js';
import type { BookmarkFetchTask } from '@/types/queue.interface.js';

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

    // Build query conditions
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

    // Query total count
    const total = await BookmarkModel.countDocuments(filter);
    // Query paginated content
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
      // Pinned bookmarks
      BookmarkModel.find({ user: userId, isPinned: BookmarkPinnedEnum.YES })
        .populate(['categories', 'tags'])
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean<IBookmarkLean[]>(),

      // Recently visited bookmarks
      BookmarkModel.find({ user: userId, lastVisitedAt: { $exists: true } })
        .populate(['categories', 'tags'])
        .sort({ lastVisitedAt: -1 })
        .limit(10)
        .lean<IBookmarkLean[]>(),

      // Recently added bookmarks
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

    // Import result statistics
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

    // Create categories
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
        result.errors.push(`Failed to import category "${category.name}": ${error.message}`);
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
        result.errors.push(`Failed to import bookmark "${bookmark.title}, ${bookmark.url}": ${error.message}`);
      }
    }

    return result;
  }

  async _generateHtmlBookmarks(bookmarks: IBookmarkLean[]) {
    // Create HTML document header - Netscape Bookmark File Format compliant
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

    // Organize bookmarks by category
    const categoryMap: {
      [key: string]: IBookmarkLean[];
    } = {};
    const noFolderBookmarks: IBookmarkLean[] = [];

    /**
     * Escape HTML special characters to prevent HTML injection
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
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

    // Group bookmarks by category
    bookmarks.forEach((bookmark) => {
      if (bookmark.categories && bookmark.categories.length > 0) {
        // Use the first category as a folder (if there are multiple categories)
        const category = bookmark.categories[0].name;
        if (!categoryMap[category]) {
          categoryMap[category] = [];
        }
        categoryMap[category].push(bookmark);
      } else {
        // Handle bookmarks without categories separately
        noFolderBookmarks.push(bookmark);
      }
    });

    // Add bookmarks without categories first
    if (noFolderBookmarks.length > 0) {
      html += `    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">Uncategorized</H3>\n`;
      html += `    <DL><p>\n`;

      noFolderBookmarks.forEach((bookmark) => {
        // Parse creation time string to timestamp
        const createdAt = bookmark.createdAt
          ? new Date(bookmark.createdAt).getTime() / 1000
          : Math.floor(Date.now() / 1000);

        // Escape special characters to prevent HTML injection
        const safeTitle = escapeHtml(bookmark.title || 'Untitled');
        const safeUrl = escapeHtml(bookmark.url);

        html += `        <DT><A HREF="${safeUrl}" ADD_DATE="${Math.floor(createdAt)}">${safeTitle}</A>\n`;

        // If there is a description, add description
        if (bookmark.description) {
          html += `        <DD>${escapeHtml(bookmark.description)}\n`;
        }
      });

      html += `    </DL><p>\n`;
    }

    // Generate HTML for each category
    Object.keys(categoryMap).forEach((category) => {
      const folderDate = Math.floor(Date.now() / 1000);
      const safeCategoryName = escapeHtml(category);

      // Add category folder
      html += `    <DT><H3 ADD_DATE="${folderDate}" LAST_MODIFIED="${folderDate}">${safeCategoryName}</H3>\n`;
      html += `    <DL><p>\n`;

      // Add bookmarks in this category
      categoryMap[category].forEach((bookmark) => {
        // Parse creation time string to timestamp
        const createdAt = bookmark.createdAt
          ? new Date(bookmark.createdAt).getTime() / 1000
          : Math.floor(Date.now() / 1000);

        // Escape special characters
        const safeTitle = escapeHtml(bookmark.title || 'Untitled');
        const safeUrl = escapeHtml(bookmark.url);

        html += `        <DT><A HREF="${safeUrl}" ADD_DATE="${Math.floor(createdAt)}"`;

        // Add icon (if any)
        if (bookmark.icon && !bookmark.icon.startsWith('data:')) {
          html += ` ICON="${escapeHtml(bookmark.icon)}"`;
        }

        html += `>${safeTitle}</A>\n`;

        // If there is a description, add description
        if (bookmark.description) {
          html += `        <DD>${escapeHtml(bookmark.description)}\n`;
        }
      });

      // Close category folder tag
      html += `    </DL><p>\n`;
    });

    // Close HTML document
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
