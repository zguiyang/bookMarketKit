import type {
  ApiResponse,
  BookmarkPageListQuery,
  BookmarkPageListResponse,
  CategoryListResponse,
  TagListResponse,
} from '@bookmark/schemas';

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

  const fetchAllCategories = () => {
    return useAsyncData(
      'bookmarkCategories',
      () =>
        $api<ApiResponse<CategoryListResponse>>('/bookmark/category/all', {
          method: 'GET',
        }),
      {
        transform: (res) => {
          return res.data;
        },
      }
    );
  };

  const fetchAllTags = () => {
    return useAsyncData(
      'bookmarkTags',
      () =>
        $api<ApiResponse<TagListResponse>>('/bookmark/tag/all', {
          method: 'GET',
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
    fetchAllCategories,
    fetchAllTags,
  };
};
