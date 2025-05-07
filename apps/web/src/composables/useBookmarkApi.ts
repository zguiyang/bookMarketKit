import type { ApiResponse, BookmarkPageListQuery, BookmarkPageListResponse } from '@bookmark/schemas';

export const useBookmarkApi = () => {
  const { $api } = useNuxtApp(); // 获取注入的 $api 实例

  const fetchPageList = (query: BookmarkPageListQuery) => {
    return useAsyncData('bookmarkPageList', () =>
      $api<ApiResponse<BookmarkPageListResponse>>('/bookmark/pageList', {
        method: 'GET',
        params: query,
      })
    );
  };

  return {
    fetchPageList,
  };
};
