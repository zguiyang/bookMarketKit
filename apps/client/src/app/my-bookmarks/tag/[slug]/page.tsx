'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { useState } from 'react'
import { BookmarkCard } from "@/components/bookmark/bookmark-card"
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
  }
]

export default function TagPage() {
  const params = useParams()
  const tagSlug = params.slug as string
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks)

  // 根据标签筛选书签
  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.tags.some(tag => tag.toLowerCase() === decodeURIComponent(tagSlug).toLowerCase())
  )

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
          title={`标签：${decodeURIComponent(tagSlug)}`}
          description={`查看标签"${decodeURIComponent(tagSlug)}"下的所有书签`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map(bookmark => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onStarClick={() => handleStarClick(bookmark)}
              onPinClick={() => handlePinClick(bookmark)}
            />
          ))}
          {filteredBookmarks.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              没有找到包含此标签的书签
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 