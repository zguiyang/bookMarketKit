'use client'

import {useState} from 'react'
import {BookmarkApi, BookMarkFavoriteEnums} from '@/api/bookmark';
import {PageHeader} from '@/components/page-header'
import {BookmarkCard} from "@/components/bookmark/bookmark-card"
import {BookmarkSkeleton} from "@/components/bookmark/bookmark-skeleton"
import {EmptyPlaceholder} from "@/components/empty-placeholder"
import {Heart} from "lucide-react"
import {usePagination} from "alova/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

export default function StarredPage() {
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
        isFavorite: BookMarkFavoriteEnums.Favorite,
      }),
      {
        append: false,
        initialPage: 1,
        initialPageSize: 40,
        total: ({data: res}) => res.total,
        data: ({data: res}) => res.content,
      }
  )

  const [totalPages, setTotalPages] = useState<number>(0);

  onPageListSuccess(({data:res}) => {
    if (res.success) {
      setTotalPages(res.data.pages);
    }
  })

  const handleUpdateAction = async () => {
    await getPageList();
  }

  const handlePageChange = async (newPage: number) => {
    if (isLoading) return;
    update({
      page: newPage,
    });
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title="最喜欢的"
          description="我喜欢的所有书签列表"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <BookmarkSkeleton count={6} />
          ) : bookmarkList.length === 0 ? (
            <div className="col-span-full">
              <EmptyPlaceholder
                icon={Heart}
                title="暂无收藏书签"
                description="你还没有收藏任何书签，可以通过点击书签上的心形图标来收藏书签。"
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
              <Pagination>
                <PaginationContent className="flex items-center gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                        onClick={() => !isLoading && handlePageChange(page - 1)}
                        className={`${page <= 1 || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"} flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md`}
                    >
                      上一页
                    </PaginationPrevious>
                  </PaginationItem>
                  {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                            onClick={() => !isLoading && handlePageChange(pageNum)}
                            isActive={page === pageNum}
                            className={`${isLoading ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"} px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${page === pageNum ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                        onClick={() => !isLoading && handlePageChange(page + 1)}
                        className={`${page >= totalPages || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"} flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md`}
                    >
                      下一页
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
        )}
      </div>
    </div>
  )
} 