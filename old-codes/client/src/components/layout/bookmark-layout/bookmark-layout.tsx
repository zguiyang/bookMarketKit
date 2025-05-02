"use client"

import { ReactNode, useState } from "react"
import { useRequest } from 'alova/client';
import { BookmarkForm } from "@/components/bookmark/bookmark-form"
import { BookmarkApi } from '@/api/bookmark';

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Content } from "./content"

export interface BookmarkLayoutProps {
  children: ReactNode
}

export function BookmarkLayout({ children }: BookmarkLayoutProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const [showAddBookmarkForm, setShowAddBookmarkForm] = useState(false)
  const { send: postCreateBookmark } = useRequest(BookmarkApi.create, {
    immediate: false,
  })

  const handleAddBookmark = () => {
    setShowAddBookmarkForm(true)
  }

  const handleSubmitBookmark = async (values: {
    title: string
    url: string
    icon?: string
    categoryId?: string;
    tagId?: string;
  }) => {
    const { success } = await postCreateBookmark({
      title: values.title,
      url: values.url,
      icon: values.icon,
      tagIds: values.tagId ? [ values.tagId ]:undefined,
      categoryIds: values.categoryId ? [values.categoryId]:undefined,
    });
    if (success) {
      setShowAddBookmarkForm(false);
      setRefreshKey(prev => prev + 1);
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onAddBookmark={handleAddBookmark} />
        <Content key={refreshKey}>
          {children}
        </Content>
        <BookmarkForm
          mode="create"
          open={showAddBookmarkForm}
          onOpenChange={setShowAddBookmarkForm}
          onSubmit={handleSubmitBookmark}
        />
      </main>
    </div>
  )
} 