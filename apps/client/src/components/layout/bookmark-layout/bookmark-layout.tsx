"use client"

import { ReactNode, useState } from "react"
import { Bookmark } from '@/types/bookmark'
import { BookmarkForm, BookmarkFormValues } from "@/components/bookmark-form"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Content } from "./content"

interface BookmarkLayoutProps {
  children: ReactNode
}

export function BookmarkLayout({ children }: BookmarkLayoutProps) {
  const [showAddBookmarkForm, setShowAddBookmarkForm] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

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
      pinned: false,
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header bookmarks={bookmarks} onAddBookmark={handleAddBookmark} />
        <Content>{children}</Content>
        <BookmarkForm
          open={showAddBookmarkForm}
          onOpenChange={setShowAddBookmarkForm}
          onSubmit={handleSubmitBookmark}
        />
      </main>
    </div>
  )
} 