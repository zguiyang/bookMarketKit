'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { useState } from 'react'
import { BookmarkCard } from "@/components/bookmark/bookmark-card"
import { BookmarkSkeleton } from "@/components/bookmark/bookmark-skeleton"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Tag as TagIcon } from "lucide-react"
import { usePagination, useRequest } from 'alova/client'
import { BookmarkApi, Tag } from '@/api/bookmark'
import { PaginationList } from "@/components/pagination-list"

export default function TagsPage() {
  const params = useParams()
  const tagSlug = params.slug as string
  const [tagInfo, setTagInfo] = useState<Partial<Tag>>({ })

  // 获取标签详情
  const { onSuccess: onSuccessTagInfo } = useRequest(() => BookmarkApi.queryOneTag(tagSlug))

  // 获取书签列表
  const {
    data: bookmarkList = [],
    send: getPageList,
    page,
    update,
    onSuccess: onPageListSuccess,
    loading: isLoading,
  } = usePagination(
    (page, pageSize) => BookmarkApi.pageList({
      page,
      pageSize,
      tagId: tagSlug,
    }),
    {
      append: false,
      initialPage: 1,
      initialPageSize: 40,
      total: ({data: res}) => res.total,
      data: ({data: res}) => res.content,
    }
  )

  const [totalPages, setTotalPages] = useState<number>(0)

  onSuccessTagInfo(({data:res}) => {
    if (res.success && res.data) {
      setTagInfo(res.data)
    }
  })

  onPageListSuccess(({data:res}) => {
    if (res.success) {
      setTotalPages(res.data.pages)
    }
  })

  const handleUpdateAction = async () => {
    await getPageList()
  }

  const handlePageChange = async (newPage: number) => {
    if (isLoading) return
    update({
      page: newPage,
    })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title={`标签：${tagInfo.name ?? ''}`}
          description={`查看标签"${tagInfo.name ?? ''}"下的所有书签`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <BookmarkSkeleton count={6} />
          ) : bookmarkList.length === 0 ? (
            <div className="col-span-full">
              <EmptyPlaceholder
                icon={TagIcon}
                title="暂无相关书签"
                description={`当前标签下还没有任何书签。`}
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
        {(bookmarkList.length > 0 || isLoading) && (
          <div className="mt-8 flex justify-center">
            <PaginationList
              currentPage={page}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
} 