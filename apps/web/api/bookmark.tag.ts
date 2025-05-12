import request from '@/lib/request';
import { ApiResponse, TagResponse, CreateTagBody, UpdateTagBody } from '@bookmark/schemas';

class BookmarkTag {
  all() {
    return request.Get<ApiResponse<TagResponse[]>>('/bookmark/tag/all');
  }

  findOne(id: string) {
    return request.Get<ApiResponse<TagResponse>>(`/bookmark/tag/detail/${id}`);
  }

  create(data: CreateTagBody) {
    return request.Post<ApiResponse>('/bookmark/tag/create', data);
  }

  update(data: UpdateTagBody) {
    return request.Put<ApiResponse>('/bookmark/tag/update', data);
  }

  del(id: string) {
    return request.Delete<ApiResponse>(`/bookmark/tag/delete/${id}`);
  }
}

export const BookmarkTagApi = new BookmarkTag();
