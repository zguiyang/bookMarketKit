import { BookmarkCategoryApi, BookmarkTagApi } from '@/api';
import type { TagResponse, CategoryResponse } from '~shared/schemas';
import { useRequest } from 'alova/client';
import { useState } from 'react';

export function useBookmarkData() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const { onSuccess: onCategorySuccess, loading: categoriesLoading } = useRequest(BookmarkCategoryApi.all);
  const { onSuccess: onTagSuccess, loading: tagsLoading } = useRequest(BookmarkTagApi.all);

  onCategorySuccess(({ data: res }) => {
    if (res.success) {
      setCategories(res.data);
    }
  });
  onTagSuccess(({ data: res }) => {
    if (res.success) {
      setTags(res.data);
    }
  });

  return {
    categories,
    setCategories,
    categoriesLoading,
    tags,
    setTags,
    tagsLoading,
  };
}
