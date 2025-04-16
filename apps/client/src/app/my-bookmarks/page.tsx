"use client"

import { useState } from "react"
import {  useRequest, usePagination } from 'alova/client';
import { BookmarkApi, Bookmark } from '@/api/bookmark';
import { BookmarkCard } from "@/components/bookmark-card"

export default function BookmarksPage() {
  const { onSuccess: onCollectionSuccess } = useRequest(BookmarkApi.collection);

  const { data: bookmarkList } = usePagination(
      (page, pageSize) => BookmarkApi.pageList({
        page,
        pageSize,
      }),
      {
        append: true,
        initialPage: 1,
        initialPageSize: 20,
        total: ({ data: res }) => res.total,
        data: ({ data: res }) => res.content,
      }
  );
  const [pinnedBookmarks, setPinnedBookmarks] = useState<Bookmark[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);

  onCollectionSuccess((event) => {
    const { data: res } = event;
    if (res.success && res.data) {
      setPinnedBookmarks(res.data.pinnedBookmarks)
      setRecentBookmarks(res.data.recentBookmarks)
    }
  })


  return (
    <div className="px-4 py-8">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">📌 置顶书签</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pinnedBookmarks.map((bookmark) => (
              <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
              />
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🕒 最近访问</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentBookmarks.map((bookmark) => (
              <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
              />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">📚 所有书签</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bookmarkList.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
            />
          ))}
        </div>
      </section>
    </div>
  )
} 