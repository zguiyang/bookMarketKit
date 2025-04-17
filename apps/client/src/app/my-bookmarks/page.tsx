"use client"

import {useState} from "react"
import {useRequest} from 'alova/client';
import {BookmarkApi, Bookmark} from '@/api/bookmark';
import {BookmarkCard} from "@/components/bookmark/bookmark-card"

export default function BookmarksPage() {
    const [pinnedBookmarks, setPinnedBookmarks] = useState<Bookmark[]>([]);
    const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);
    const [recentAddedBookmarks, setRecentAddedBookmarks] = useState<Bookmark[]>([])

    const {onSuccess: onCollectionSuccess, send: getCollection} = useRequest(BookmarkApi.collection);

    onCollectionSuccess((event) => {
        const {data: res} = event;
        if (res.success && res.data) {
            setPinnedBookmarks(res.data.pinnedBookmarks)
            setRecentBookmarks(res.data.recentBookmarks)
            setRecentAddedBookmarks(res.data.recentAddedBookmarks)
        }
    })

    const handleUpdateAction = async () => {
        await getCollection();
    }

    return (
        <div className="px-4 py-8">
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">📌 置顶书签</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pinnedBookmarks.map((bookmark) => (
                        <BookmarkCard
                            onUpdateBookmark={handleUpdateAction}
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
                            onUpdateBookmark={handleUpdateAction}
                            key={bookmark.id}
                            bookmark={bookmark}
                        />
                    ))}
                </div>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">🆕 最近新增</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {recentAddedBookmarks.map((bookmark) => (
                        <BookmarkCard
                            onUpdateBookmark={handleUpdateAction}
                            key={bookmark.id}
                            bookmark={bookmark}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
} 