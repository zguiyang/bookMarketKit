import request from "@/lib/request";
import { ApiResponse } from '@/types/response';
import { BookmarkCollection, BookmarkPageListReq, BookMarkPageListRes, BookMarkFavoriteReq, BookMarkPinnedReq } from './types';

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
        return request.Patch<ApiResponse<any>>('bookmark/favorite', data);
    }
    setPinned(data: BookMarkPinnedReq) {
        return request.Patch<ApiResponse<any>>('bookmark/pinned', data);
    }
    visit(id: string) {
        return request.Patch<ApiResponse<any>>('bookmark/visit', {
            id
        });
    }
}

export const BookmarkApi = new BookMark();