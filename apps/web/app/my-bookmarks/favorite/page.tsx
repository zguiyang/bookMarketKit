'use client';

import { useState } from 'react';
import { BookmarkFavoriteEnum } from '@bookmark/schemas';
import { BookmarkApi } from '@/api';
import { PageHeader } from '@/components/page-header';
import { BookmarkCard } from '@/components/bookmark/bookmark-card';
import { BookmarkSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Heart } from 'lucide-react';
import { usePagination } from 'alova/client';
import { PaginationList } from '@/components/pagination-list';

export default function FavoritePage() {
  const {
    data: bookmarkList = [],
    send: getPageList,
    page,
    update,
    onSuccess: onPageListSuccess,
    loading: isLoading,
  } = usePagination(
    (page, pageSize) =>
      BookmarkApi.pageList({
        page,
        pageSize,
        isFavorite: BookmarkFavoriteEnum.YES,
      }),
    {
      append: false,
      initialPage: 1,
      initialPageSize: 40,
      total: ({ data: res }) => res.total,
      data: ({ data: res }) => res.content,
    }
  );

  const [totalPages, setTotalPages] = useState<number>(0);

  onPageListSuccess(({ data: res }) => {
    if (res.success) {
      setTotalPages(res.data.pages);
    }
  });

  const handleUpdateAction = async () => {
    await getPageList();
  };

  const handlePageChange = async (newPage: number) => {
    if (isLoading) return;
    update({
      page: newPage,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <PageHeader title="最喜欢的" description="我喜欢的所有书签列表" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <BookmarkSkeleton count={6} />
          ) : bookmarkList.length === 0 ? (
            <div className="col-span-full">
              <EmptyPlaceholder
                icon={Heart}
                title="暂无收藏书签"
                description="你还没有收藏任何书签，可以通过点击书签上的心形图标来收藏书签。"
              />
            </div>
          ) : (
            bookmarkList.map((bookmark) => (
              <BookmarkCard key={bookmark._id} bookmark={bookmark} onUpdateBookmark={handleUpdateAction} />
            ))
          )}
        </div>
        {(bookmarkList.length > 0 || isLoading) && (
          <div className="mt-8 flex justify-center">
            <PaginationList
              currentPage={page}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
