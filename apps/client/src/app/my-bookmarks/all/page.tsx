"use client"

import {useState} from "react"
import { usePagination } from 'alova/client';
import {BookmarkApi} from '@/api/bookmark';
import {BookmarkCard} from "@/components/bookmark/bookmark-card"
import {BookmarkSkeleton} from "@/components/bookmark/bookmark-skeleton"
import {EmptyPlaceholder} from "@/components/empty-placeholder"
import {BookmarkPlus} from "lucide-react"
import { PaginationList } from "@/components/pagination-list"

export default function AllBookmarksPage() {
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
        <div className="px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">📚 所有书签</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                    <BookmarkSkeleton count={8} />
                ) : bookmarkList.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyPlaceholder
                            icon={BookmarkPlus}
                            title="暂无书签"
                            description='开始添加你的第一个书签吧！点击右上角的"添加书签"按钮开始。'
                        />
                    </div>
                ) : (
                    bookmarkList.map((bookmark) => (
                        <BookmarkCard
                            onUpdateBookmark={handleUpdateAction}
                            key={bookmark.id}
                            bookmark={bookmark}
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
    )
} 