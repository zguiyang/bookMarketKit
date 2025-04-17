import {Copy, Edit, MoreHorizontal, Pin, PinOff, Heart, Trash2} from "lucide-react"
import {useRequest} from 'alova/client';
import {Bookmark, BookmarkApi, BookMarkFavoriteEnums, BookMarkPinnedEnums} from '@/api/bookmark';
import {Card, CardContent} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {toast} from "sonner"
import {cn} from "@/lib/utils"

interface BookmarkCardProps {
    bookmark: Bookmark
    onUpdateBookmark?: (bookmark?: Bookmark) => void
}

export function BookmarkCard({
    bookmark,
    onUpdateBookmark,
}: BookmarkCardProps) {
    const { send: setBookmarkFavorite } = useRequest(BookmarkApi.setFavorite, {
        immediate: false,
    });
    const { send: setBookmarkPinned } = useRequest(BookmarkApi.setPinned, {
        immediate: false,
    });
    const { send: visitBookmark } = useRequest(BookmarkApi.visit, {
        immediate: false,
    });

    const handleUpdateBookmark = () => {
        onUpdateBookmark && onUpdateBookmark(bookmark)
    }

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(bookmark.url)
            toast.success("已复制链接地址")
        } catch (err) {
            toast.error("复制失败，请重试")
        }
    }

    const handleDeleteBookmark = () => {
        handleUpdateBookmark();
    }
    const handleEditBookmark = () => {
        handleUpdateBookmark()
    }
    const handlePinBookmark = async () => {
        const { success }  = await setBookmarkPinned({
            id: bookmark.id,
            isPinned: bookmark.is_pinned === BookMarkPinnedEnums.Pinned ? BookMarkPinnedEnums.UnPinned : BookMarkPinnedEnums.Pinned
        })
        if (success) {
            handleUpdateBookmark()
        }
    }
    const handleFavoriteBookmark = async () => {
        const { success }  = await setBookmarkFavorite({
            id: bookmark.id,
            isFavorite: bookmark.is_favorite === BookMarkFavoriteEnums.Favorite ? BookMarkFavoriteEnums.UnFavorite : BookMarkFavoriteEnums.Favorite
        })
        if (success) {
            handleUpdateBookmark();
        }
    }

    const handleViewBookmark = async () => {
        window.open(bookmark.url, '_blank')
        await visitBookmark(bookmark.id)
    }

    return (
        <Card className="group relative overflow-hidden transition-all hover:-translate-y-1 border-gray-200 dark:border-gray-700 sm:p-2">
            <CardContent className="p-4 sm:p-3">
                {/* 标题栏部分 */}
                <div className="flex items-center justify-between mb-3 sm:mb-2">
                    <div className="flex items-center space-x-2 max-w-[70%] sm:max-w-[60%]">
                        {bookmark.icon && (
                            <div className="w-6 h-6 flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={bookmark.icon}
                                    alt=""
                                    className="w-5 h-5 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none'
                                    }}
                                />
                            </div>
                        )}
                        <h3
                            onClick={handleViewBookmark}
                            className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors cursor-pointer"
                            title={bookmark.title}
                        >
                            {bookmark.title}
                        </h3>
                    </div>

                    {/* 操作按钮组 */}
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleFavoriteBookmark}
                            className={cn(
                                "size-8 sm:size-7",
                                "cursor-pointer transition-colors",
                                bookmark.is_favorite && "text-red-500 hover:text-red-600"
                            )}
                        >
                            <Heart className={cn("size-4 sm:size-3.5", bookmark.is_favorite && "fill-current")} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePinBookmark}
                            className="size-8 sm:size-7 cursor-pointer transition-colors"
                        >
                            {bookmark.is_pinned ? (
                                <Pin className="size-4 sm:size-3.5 fill-current" />
                            ) : (
                                <PinOff className="size-4 sm:size-3.5" />
                            )}
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 sm:size-7"
                                >
                                    <MoreHorizontal className="size-4 sm:size-3.5" />
                                    <span className="sr-only">更多操作</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem onClick={handleCopyUrl}>
                                    <Copy className="size-4 mr-2" />
                                    复制链接
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handlePinBookmark}>
                                    <Pin className="size-4 mr-2" />
                                    {bookmark.is_pinned ? "取消置顶" : "置顶"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleEditBookmark}>
                                    <Edit className="size-4 mr-2" />
                                    编辑
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleDeleteBookmark}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="size-4 mr-2 text-red-500" />
                                    删除
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* 描述部分 */}
                {bookmark.description && (
                    <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                            {bookmark.description}
                        </p>
                        <div className="h-4 relative">
                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-900 to-transparent group-hover:opacity-0 transition-opacity" />
                        </div>
                    </div>
                )}

                {/* 分类和标签部分 */}
                <div className="flex flex-wrap gap-1.5">
                    {/* 分类标签组 */}
                    {bookmark.categories.map((category) => (
                        <span
                            key={category.id}
                            className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-colors"
                        >
                            {category.name}
                        </span>
                    ))}
                    {bookmark.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="px-2 py-0.5 rounded-md text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
            </CardContent>

            {/* 悬停渐变效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Card>
    )
} 