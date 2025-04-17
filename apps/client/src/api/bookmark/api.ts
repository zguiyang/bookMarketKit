import request from "@/lib/request";
import { ApiResponse } from '@/types/response';
import { BookmarkCollection, BookmarkPageListReq, BookMarkPageListRes, BookMarkFavoriteReq, BookMarkPinnedReq, Category,
    Tag, CreateCategoryReq, UpdateCategoryReq, UpdateTagReq, CreateTagReq,
} from './types';

class BookMark {
    collection() {
        return request.Get<ApiResponse<BookmarkCollection>>('bookmark/collection');
    }

    pageList (params: BookmarkPageListReq) {
        return request.Get<BookMarkPageListRes>('/bookmark/pageList', {
            params,
        });
    }

    setFavorite(data: BookMarkFavoriteReq) {
        return request.Patch<ApiResponse>('/bookmark/favorite', data);
    }

    setPinned(data: BookMarkPinnedReq) {
        return request.Patch<ApiResponse>('/bookmark/pinned', data);
    }

    visit(id: string) {
        return request.Patch<ApiResponse>('/bookmark/visit', {
            id
        });
    }

    /* ---------------- BookMark Category ----------------------------*/

    categories() {
        return request.Get<ApiResponse<Category[]>>('/bookmark/category/all');
    }
    queryOneCategory(id: string) {
        return request.Get<ApiResponse<Category>>(`/bookmark/category/detail/${id}`)
    }
    createCategory (data: CreateCategoryReq) {
        return request.Post<ApiResponse<Category>>('/bookmark/category/create', data)
    }
    updateCategory(data: UpdateCategoryReq) {
        return request.Put<ApiResponse>('/bookmark/category/update', data);
    }
    delCategory(id: string) {
        return request.Delete<ApiResponse>(`/bookmark/category/delete/${id}`)
    }

    /* ---------------- BookMark Tag ----------------------------*/

    tags() {
        return request.Get<ApiResponse<Tag[]>>('/bookmark/tag/all');
    }
    queryOneTag(id: string) {
        return request.Get<ApiResponse<Tag>>(`/bookmark/tag/detail/${id}`)
    }
    createTag(data: CreateTagReq) {
        return request.Post<ApiResponse>('/bookmark/tag/create', data);
    }
    updateTag(data: UpdateTagReq) {
        return request.Put<ApiResponse>('/bookmark/tag/update', data);
    }
    delTag(id: string) {
        return request.Delete<ApiResponse>(`/bookmark/tag/delete/${id}`)
    }
}

export const BookmarkApi = new BookMark();