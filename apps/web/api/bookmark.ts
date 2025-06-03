import request from '@/lib/request';
import {
  ApiResponse,
  BookmarkCollectionResponse,
  BookmarkPageListQuery,
  BookmarkPageListResponse,
  BookmarkSearchQuery,
  BookmarkSearchResponse,
  SetFavoriteBody,
  SetPinnedBody,
  CreateBookmarkBody,
  UpdateBookmarkBody,
  BookmarkResponse,
  BookmarkImportBody,
  BookmarkImportResponse,
} from '@bookmark/schemas';

class Bookmark {
  create(data: CreateBookmarkBody) {
    return request.Post<ApiResponse<BookmarkResponse>>('/bookmark/create', data);
  }

  update(data: UpdateBookmarkBody) {
    return request.Put<ApiResponse<BookmarkResponse>>('/bookmark/update', data);
  }

  delete(id: string) {
    return request.Delete<ApiResponse>(`/bookmark/delete/${id}`);
  }

  collection() {
    return request.Get<ApiResponse<BookmarkCollectionResponse>>('bookmark/collection');
  }

  pageList(params: BookmarkPageListQuery) {
    return request.Get<ApiResponse<BookmarkPageListResponse>>('/bookmark/pageList', {
      params,
    });
  }

  search({ keyword }: BookmarkSearchQuery) {
    return request.Get<ApiResponse<BookmarkSearchResponse>>('/bookmark/search', {
      params: { keyword },
    });
  }

  setFavorite(data: SetFavoriteBody) {
    return request.Patch<ApiResponse>('/bookmark/favorite', data);
  }

  setPinned(data: SetPinnedBody) {
    return request.Patch<ApiResponse>('/bookmark/pinned', data);
  }

  visit(id: string) {
    return request.Patch<ApiResponse>('/bookmark/visit', {
      id,
    });
  }
  import(data: BookmarkImportBody) {
    return request.Post<ApiResponse<BookmarkImportResponse>>('/bookmark/import', data);
  }
  export() {
    return request.Get<
      ApiResponse<{
        file: Blob;
        name: string;
      }>
    >('/bookmark/export', {
      responseType: 'blob',
    });
  }
}

export const BookmarkApi = new Bookmark();
