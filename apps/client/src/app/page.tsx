"use client"

import { useState } from "react"
import { BookmarkCard } from "@/components/bookmark-card"
import { Plus } from "lucide-react"
import { Bookmark } from '@/types/bookmark'
import { Button} from '@/components/ui/button';
import { MainLayout } from "@/components/layout/main-layout"
import { CommandMenu } from "@/components/command-menu"
import { BookmarkForm, BookmarkFormValues } from "@/components/bookmark-form"

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
    tags: ["问答", "编程"],
    starred: true,
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
    lastVisited: "2024-04-06"
  }
]

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks)
  const [showAddBookmarkForm, setShowAddBookmarkForm] = useState(false)

  const handleStarClick = (id: number) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === id ? { ...bookmark, starred: !bookmark.starred } : bookmark
    ))
  }

  const handleAddBookmark = () => {
    setShowAddBookmarkForm(true)
  }

  const handleSubmitBookmark = (values: BookmarkFormValues) => {
    // 生成一个简单的ID（在实际应用中会由后端生成）
    const newId = Math.max(0, ...bookmarks.map(b => b.id)) + 1
    
    // 尝试从URL中获取图标
    let icon = ""
    try {
      const url = new URL(values.url)
      icon = `${url.protocol}//${url.hostname}/favicon.ico`
    } catch (error) {
      console.error("Invalid URL for favicon:", error)
    }
    
    // 创建新书签
    const newBookmark: Bookmark = {
      id: newId,
      title: values.title,
      url: values.url,
      description: values.description || "",
      icon,
      category: values.category || "",
      subcategory: values.subcategory || "",
      tags: Array.isArray(values.tags) ? values.tags : [],
      starred: values.starred,
      lastVisited: new Date().toISOString().split("T")[0]
    }
    
    // 添加到书签列表
    setBookmarks([newBookmark, ...bookmarks])
  }

  return (
    <MainLayout>
      {/* 搜索栏和操作区 */}
      <div className="flex-none bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <CommandMenu bookmarks={bookmarks} />
          </div>
          <Button onClick={handleAddBookmark}>
            <Plus className="w-5 h-5" />
            <span>新增书签</span>
          </Button>
        </div>
      </div>

      {/* 书签列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map(bookmark => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onStarClick={() => handleStarClick(bookmark.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 添加书签表单 */}
      <BookmarkForm
        open={showAddBookmarkForm}
        onOpenChange={setShowAddBookmarkForm}
        onSubmit={handleSubmitBookmark}
      />
    </MainLayout>
  )
}
