'use client';

import { useState } from 'react';
import { useRequest } from 'alova/client';
import { BookmarkApi, Bookmark } from '@/api/bookmark';
import { BookmarkCard } from '@/components/bookmark/bookmark-card';
import { BookmarkSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Pin, Clock, Plus } from 'lucide-react';

export default function BookmarksPage() {
  const [pinnedBookmarks, setPinnedBookmarks] = useState<Bookmark[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);
  const [recentAddedBookmarks, setRecentAddedBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { onSuccess: onCollectionSuccess, send: getCollection } = useRequest(BookmarkApi.collection);

  onCollectionSuccess((event) => {
    const { data: res } = event;
    if (res.success && res.data) {
      setPinnedBookmarks(res.data.pinnedBookmarks);
      setRecentBookmarks(res.data.recentBookmarks);
      setRecentAddedBookmarks(res.data.recentAddedBookmarks);
    }
    setIsLoading(false);
  });

  const handleUpdateAction = async () => {
    setIsLoading(true);
    await getCollection();
  };

  return (
    <div className="px-4 py-8">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">📌 置顶书签</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            <BookmarkSkeleton count={4} />
          ) : pinnedBookmarks.length === 0 ? (
            <div className="col-span-full">
              <EmptyPlaceholder
                icon={Pin}
                title="暂无置顶书签"
                description="你可以通过点击书签上的图钉图标来置顶重要的书签。"
              />
            </div>
          ) : (
            pinnedBookmarks.map((bookmark) => (
              <BookmarkCard onUpdateBookmark={handleUpdateAction} key={bookmark.id} bookmark={bookmark} />
            ))
          )}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🕒 最近访问</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            <BookmarkSkeleton count={4} />
          ) : recentBookmarks.length === 0 ? (
            <div className="col-span-full">
              <EmptyPlaceholder icon={Clock} title="暂无最近访问" description="这里会显示你最近访问过的书签记录。" />
            </div>
          ) : (
            recentBookmarks.map((bookmark) => (
              <BookmarkCard onUpdateBookmark={handleUpdateAction} key={bookmark.id} bookmark={bookmark} />
            ))
          )}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🆕 最近新增</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            <BookmarkSkeleton count={4} />
          ) : recentAddedBookmarks.length === 0 ? (
            <div className="col-span-full">
              <EmptyPlaceholder icon={Plus} title="暂无新增书签" description="这里会显示你最近添加的新书签。" />
            </div>
          ) : (
            recentAddedBookmarks.map((bookmark) => (
              <BookmarkCard onUpdateBookmark={handleUpdateAction} key={bookmark.id} bookmark={bookmark} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
