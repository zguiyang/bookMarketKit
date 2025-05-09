import type {
  ApiResponse,
  BookmarkCollectionResponse,
  BookmarkPageListQuery,
  BookmarkPageListResponse,
  CategoryListResponse,
  TagListResponse,
  SetFavoriteBody,
  SetPinnedBody,
  BookmarkSearchQuery,
  BookmarkSearchResponse,
} from '@bookmark/schemas';

export const useBookmarkApi = () => {
  const { $api } = useNuxtApp();

  const fetchCollection = () => {
    return useAsyncData(
      'bookmarkCollection',
      () =>
        $api<ApiResponse<BookmarkCollectionResponse>>('/bookmark/collection', {
          method: 'GET',
        }),
      {
        transform: (res) => {
          return res.data;
        },
      }
    );
  };

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

  const search = (query: BookmarkSearchQuery) =>
    $api<ApiResponse<BookmarkSearchResponse>>('/bookmark/search', {
      method: 'GET',
      params: query,
    });

  const visited = (id: string) => {
    return $api<ApiResponse<BookmarkPageListResponse>>('/bookmark/visit', {
      method: 'PATCH',
      body: { id },
    });
  };

  const pinned = (body: SetPinnedBody) => {
    return $api<ApiResponse<BookmarkPageListResponse>>('/bookmark/pinned', {
      method: 'PATCH',
      body,
    });
  };

  const favorite = (body: SetFavoriteBody) => {
    return $api<ApiResponse<BookmarkPageListResponse>>('/bookmark/favorite', {
      method: 'PATCH',
      body,
    });
  };

  return {
    fetchCollection,
    fetchPageList,
    search,
    visited,
    pinned,
    favorite,
  };
};

export const useBookmarkCategoryApi = () => {
  const { $api } = useNuxtApp();

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

  return {
    fetchAllCategories,
  };
};

export const useBookmarkTagApi = () => {
  const { $api } = useNuxtApp();

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
    fetchAllTags,
  };
};
