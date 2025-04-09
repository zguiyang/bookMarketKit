'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { BookmarkCard } from "@/components/bookmark-card"
import { Bookmark } from '@/types/bookmark'

// 模拟数据，后续可以替换为真实的API调用
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
    pinned: false,
    lastVisited: "2024-03-20"
  },
  {
    id: 2,
    title: "Vue.js",
    url: "https://vuejs.org",
    description: "渐进式 JavaScript 框架",
    icon: "https://vuejs.org/favicon.ico",
    category: "开发工具",
    subcategory: "框架",
    tags: ["Vue", "JavaScript"],
    starred: true,
    pinned: false,
    lastVisited: "2024-04-06"
  }
]

export default function StarredPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks)

  // 筛选收藏的书签
  const starredBookmarks = bookmarks.filter(bookmark => bookmark.starred)

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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title="我的收藏"
          description="查看所有已收藏的书签"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {starredBookmarks.map(bookmark => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onStarClick={() => handleStarClick(bookmark)}
              onPinClick={() => handlePinClick(bookmark)}
            />
          ))}
          {starredBookmarks.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              还没有收藏任何书签
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 