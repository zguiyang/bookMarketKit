import request from "@/lib/request";
import { ApiResponse } from '@/types/response';
import { BookmarkCollection, BookmarkPageListReq, BookMarkPageListRes } from './types';

class BookMark {
    collection() {
        return request.Get<ApiResponse<BookmarkCollection>>('bookmark/collection');
    }
    pageList (params: BookmarkPageListReq) {
        return request.Get<BookMarkPageListRes>('/bookmark/pageList', {
            params,
        });
    }
}

export const BookmarkApi = new BookMark();