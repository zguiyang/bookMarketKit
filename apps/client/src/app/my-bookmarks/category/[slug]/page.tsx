'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { BookmarkCard } from "@/components/bookmark/bookmark-card"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { FolderOpen } from "lucide-react"
import { BookmarkSkeleton } from "@/components/bookmark/bookmark-skeleton"
import {usePagination, useRequest} from 'alova/client';
import { BookmarkApi, Category } from '@/api/bookmark';
import {useState} from "react";

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string
  const [categoryInfo, setCategoryInfo] = useState<Partial<Category>>({})
  const { onSuccess: onSuccessCategoryInfo } = useRequest(() => BookmarkApi.queryOneCategory(categorySlug));
  const {
    data: bookmarkList = [],
    send: getPageList,
    loading: isLoading,
  } = usePagination(
    (page, pageSize) => BookmarkApi.pageList({
      page,
      pageSize,
      categoryId: categorySlug,
    }),
    {
      append: false,
      initialPage: 1,
      initialPageSize: 40,
      total: ({data: res}) => res.total,
      data: ({data: res}) => res.content,
    }
  )


  onSuccessCategoryInfo(({data:res}) => {
    if (res.success && res.data) {
      setCategoryInfo(res.data)
    }
  })

  const handleUpdateAction = async () => {
    await getPageList();
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title={`分类：${categoryInfo.name ?? ''}`}
          description={`查看分类"${categoryInfo.name ?? ''}"下的所有书签`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <BookmarkSkeleton count={6} />
          ) : bookmarkList.length === 0 ? (
            <div className="col-span-full">
              <EmptyPlaceholder
                icon={FolderOpen}
                title="暂无相关书签"
                description={`当前分类下还没有任何书签，可以通过添加书签时选择此分类来添加内容。`}
              />
            </div>
          ) : (
            bookmarkList.map(bookmark => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onUpdateBookmark={handleUpdateAction}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
} 