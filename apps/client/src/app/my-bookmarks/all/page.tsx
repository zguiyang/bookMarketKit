"use client"

import {useState} from "react"
import { usePagination } from 'alova/client';
import {BookmarkApi} from '@/api/bookmark';
import {BookmarkCard} from "@/components/bookmark/bookmark-card"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function AllBookmarksPage() {
    const {
        data: bookmarkList,
        send: getPageList,
        page,
        update,
        onSuccess: onPageListSuccess,
    } = usePagination(
        (page, pageSize) => BookmarkApi.pageList({
            page,
            pageSize,
        }),
        {
            append: false,
            initialPage: 1,
            initialPageSize: 50,
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
         update({
            page: newPage,
        });
    }

    return (
        <div className="px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">📚 所有书签</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {bookmarkList.map((bookmark) => (
                        <BookmarkCard
                            onUpdateBookmark={handleUpdateAction}
                            key={bookmark.id}
                            bookmark={bookmark}
                        />
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent className="gap-1">
                            <PaginationItem>
                                <PaginationPrevious 
                                    onClick={() => handlePageChange(page - 1)}
                                    className={`rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                                >
                                    上一页
                                </PaginationPrevious>
                            </PaginationItem>
                            {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(pageNum)}
                                        isActive={page === pageNum}
                                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${page === pageNum ? "bg-primary text-primary-foreground hover:bg-primary/90" : "cursor-pointer"}`}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(page + 1)}
                                    className={`rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                                >
                                    下一页
                                </PaginationNext>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
        </div>
    )
} 