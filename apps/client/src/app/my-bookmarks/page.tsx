"use client"

import { useState } from "react"
import { BookmarkCard } from "@/components/bookmark-card"
import { Bookmark } from '@/types/bookmark'

const mockBookmarks: Bookmark[] = [
  {
    id: 1,
    title: "GitHub",
    url: "https://github.com",
    description: "开发者协作平台",
    icon: "https://github.com/favicon.ico",
    category: "开发工具",
    subcategory: "代码托管",
    tags: ["开发", "Git"],
    starred: true,
    pinned: true,
    lastVisited: "2024-03-20"
  },
  {
    id: 2,
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "全球最大的程序员问答社区",
    icon: "https://stackoverflow.com/favicon.ico",
    category: "技术学习",
    subcategory: "问答社区",
    tags: ["开发", "问答"],
    starred: false,
    pinned: false,
    lastVisited: "2024-04-07"
  },
  {
    id: 3,
    title: "Vue.js",
    url: "https://vuejs.org",
    description: "渐进式 JavaScript 框架",
    icon: "https://vuejs.org/favicon.ico",
    category: "开发工具",
    subcategory: "框架",
    tags: ["Vue", "JavaScript"],
    starred: true,
    pinned: true,
    lastVisited: "2024-04-06"
  }
]

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks)

  const handleStarClick = (bookmark: Bookmark) => {
    setBookmarks(bookmarks.map(b => 
      b.id === bookmark.id ? { ...b, starred: !b.starred } : b
    ))
  }

  const handlePinClick = (bookmark: Bookmark) => {
    setBookmarks(bookmarks.map(b => 
      b.id === bookmark.id ? { ...b, pinned: !b.pinned } : b
    ))
  }

  // 获取置顶书签
  const pinnedBookmarks = bookmarks.filter(bookmark => bookmark.pinned)

  // 获取最近访问的书签（前5个）
  const recentBookmarks = [...bookmarks]
    .sort((a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime())
    .slice(0, 5)

  // 获取所有非置顶书签
  const normalBookmarks = bookmarks.filter(bookmark => !bookmark.pinned)

  return (
    <div className="px-4 py-8">
      {pinnedBookmarks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📌 置顶书签</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onStarClick={() => handleStarClick(bookmark)}
                onPinClick={() => handlePinClick(bookmark)}
              />
            ))}
          </div>
        </section>
      )}

      {recentBookmarks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🕒 最近访问</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onStarClick={() => handleStarClick(bookmark)}
                onPinClick={() => handlePinClick(bookmark)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-4">📚 所有书签</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {normalBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onStarClick={() => handleStarClick(bookmark)}
              onPinClick={() => handlePinClick(bookmark)}
            />
          ))}
        </div>
      </section>
    </div>
  )
} 