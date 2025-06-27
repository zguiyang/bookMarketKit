import request from '@/lib/request';
import type { ApiResponse, CategoryResponse, CreateCategoryBody, UpdateCategoryBody } from '~shared/schemas';

class BookmarkCategory {
  create(data: CreateCategoryBody) {
    return request.Post<ApiResponse<CategoryResponse>>('/bookmark/category/create', data);
  }

  update(data: UpdateCategoryBody) {
    return request.Put<ApiResponse>('/bookmark/category/update', data);
  }

  del(id: string) {
    return request.Delete<ApiResponse>(`/bookmark/category/delete/${id}`);
  }
  all() {
    return request.Get<ApiResponse<CategoryResponse[]>>('/bookmark/category/all');
  }

  findOne(id: string) {
    return request.Get<ApiResponse<CategoryResponse>>(`/bookmark/category/detail/${id}`);
  }
}

export const BookmarkCategoryApi = new BookmarkCategory();
