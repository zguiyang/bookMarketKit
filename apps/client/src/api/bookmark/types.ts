import { PageListRequest,PageListResponse  } from '@/types/paggination';

export interface Bookmark {
    categories: Category[];
    description: null;
    favicon_url: null;
    id: string;
    is_favorite: number;
    is_pinned: number;
    last_visited_at: null | string;
    screenshot_url: null | string;
    tags: Tag[];
    title: string;
    icon: string;
    url: string;
    visit_count: number;
}

export interface Category {
    description?: string;
    icon?: string;
    id: string;
    name: string;
    parent_id: null;
    updated_at: string;
    created_at: string;
    user_id: string;
}

export interface Tag {
    color?: string;
    created_at: string;
    id: string;
    name: string;
    user_id: string;
}

export type BookmarkCollection = {
    pinnedBookmarks: Bookmark[];
    recentBookmarks: Bookmark[];
}

export type BookmarkPageListReq = PageListRequest & {
    title?: string;
    tagId?: string;
    categoryId?: string;
}

export type BookMarkPageListRes = PageListResponse<Bookmark>;