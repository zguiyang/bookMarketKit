import { PageListRequest,PageListResponse  } from '@/types/paggination';

export interface Bookmark {
    categories: Category[];
    description: null  | string;
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
    parent_id?: null;
    updated_at?: string;
    created_at?: string;
    user_id?: string;
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
    recentAddedBookmarks: Bookmark[];
}

export type BookmarkPageListReq = PageListRequest & {
    title?: string;
    tagId?: string;
    categoryId?: string;
    isPinned?: BookMarkPinnedEnums;
    isFavorite?: BookMarkFavoriteEnums;
}

export type BookMarkPageListRes = PageListResponse<Bookmark>;

export enum BookMarkFavoriteEnums {
    Favorite = 1,
    UnFavorite = 0
}

export type BookMarkFavoriteReq = {
    id: string;
    isFavorite:BookMarkFavoriteEnums;
}

export enum BookMarkPinnedEnums {
    Pinned = 1,
    UnPinned = 0,
}

export type BookMarkPinnedReq = {
    id: string;
    isPinned:BookMarkPinnedEnums;
}

export type CreateCategoryReq = {
    name: string;
    description?: string;
    icon?: string;
    parentId?: string;
}

export type UpdateCategoryReq = CreateCategoryReq & {
 id: string;
}

export type CreateTagReq = {
    name: string;
    color?: string;
};
export type UpdateTagReq = CreateTagReq & {
    id: string;
}