import { BookmarkApi, Category, Tag } from '@/api/bookmark';
import { useRequest } from 'alova/client';
import { useState } from 'react';

export function useBookmarkData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const { onSuccess: onCategorySuccess, loading: categoriesLoading } = useRequest(BookmarkApi.categories);
  const { onSuccess: onTagSuccess, loading: tagsLoading } = useRequest(BookmarkApi.tags);

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
