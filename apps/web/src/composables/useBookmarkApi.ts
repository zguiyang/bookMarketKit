import type { ApiResponse, BookmarkPageListQuery, BookmarkPageListResponse } from '@bookmark/schemas';

export const useBookmarkApi = () => {
  const { $api } = useNuxtApp();

  const fetchPageList = (query: BookmarkPageListQuery) => {
    return useAsyncData(
      'bookmarkPageList',
      () =>
        $api<ApiResponse<BookmarkPageListResponse>>('/bookmark/pageList', {
          method: 'GET',
          params: query,
        }),
      {
        transform: (res) => {
          return res.data;
        },
      }
    );
  };

  return {
    fetchPageList,
  };
};
