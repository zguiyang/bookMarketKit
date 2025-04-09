import { Star, StarOff, ExternalLink, Clock, MoreHorizontal, Copy, Pin } from "lucide-react"
import { Bookmark } from "@/types/bookmark"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface BookmarkCardProps {
  bookmark: Bookmark
  onStarClick: (bookmark: Bookmark) => void
  onDeleteClick?: (bookmark: Bookmark) => void
  onEditClick?: (bookmark: Bookmark) => void
  onPinClick: () => void
}

export function BookmarkCard({ 
  bookmark, 
  onStarClick, 
  onDeleteClick, 
  onEditClick, 
  onPinClick 
}: BookmarkCardProps) {
  // 格式化最后访问日期
  const formattedDate = new Date(bookmark.lastVisited).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url)
      toast.success("已复制链接地址")
    } catch (err) {
      toast.error("复制失败，请重试")
    }
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 max-w-[80%]">
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
            <a 
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors"
              title={bookmark.title}
            >
              {bookmark.title}
            </a>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStarClick(bookmark)}
              className={cn(
                "size-8",
                bookmark.starred && "text-yellow-500"
              )}
              title={bookmark.starred ? "取消收藏" : "收藏"}
            >
              {bookmark.starred ? (
                <Star className="size-4 fill-current" />
              ) : (
                <StarOff className="size-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="size-8"
            >
              <a 
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                title="访问链接"
              >
                <ExternalLink className="size-4" />
              </a>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                >
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">更多操作</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyUrl}>
                  <Copy className="size-4 mr-2" />
                  复制链接
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onPinClick}>
                  <Pin className="size-4 mr-2" />
                  {bookmark.pinned ? "取消置顶" : "置顶"}
                </DropdownMenuItem>
                {(onEditClick || onDeleteClick) && <DropdownMenuSeparator />}
                {onEditClick && (
                  <DropdownMenuItem onClick={() => onEditClick(bookmark)}>
                    编辑
                  </DropdownMenuItem>
                )}
                {onDeleteClick && (
                  <DropdownMenuItem 
                    onClick={() => onDeleteClick(bookmark)}
                    className="text-destructive focus:text-destructive"
                  >
                    删除
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {bookmark.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {bookmark.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {bookmark.category && (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {bookmark.category}
            </span>
          )}
          {bookmark.subcategory && (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {bookmark.subcategory}
            </span>
          )}
          {bookmark.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center text-xs text-gray-500 dark:text-gray-500">
        <Clock className="size-3 mr-1 inline-flex" />
        <span>最后访问：{formattedDate}</span>
      </CardFooter>
      
      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  )
} 