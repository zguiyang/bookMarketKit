import { Star, StarOff, ExternalLink, Clock, MoreHorizontal } from "lucide-react"
import { Bookmark } from "@/types/bookmark"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface BookmarkCardProps {
  bookmark: Bookmark
  onStarClick: (bookmark: Bookmark) => void
  onDeleteClick?: (bookmark: Bookmark) => void
  onEditClick?: (bookmark: Bookmark) => void
}

export function BookmarkCard({ 
  bookmark, 
  onStarClick, 
  onDeleteClick, 
  onEditClick 
}: BookmarkCardProps) {
  // 格式化最后访问日期
  const formattedDate = new Date(bookmark.lastVisited).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

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
            <button 
              onClick={() => onStarClick(bookmark)}
              className="text-gray-400 hover:text-yellow-400 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title={bookmark.starred ? "取消收藏" : "收藏"}
              aria-label={bookmark.starred ? "取消收藏" : "收藏"}
            >
              {bookmark.starred ? (
                <Star className="w-4 h-4 fill-current text-yellow-400" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
            </button>
            
            <a 
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="访问链接"
              aria-label="访问链接"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            
            {(onEditClick || onDeleteClick) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEditClick && (
                    <DropdownMenuItem onClick={() => onEditClick(bookmark)}>
                      编辑
                    </DropdownMenuItem>
                  )}
                  {onDeleteClick && (
                    <DropdownMenuItem 
                      onClick={() => onDeleteClick(bookmark)}
                      className="text-red-500 focus:text-red-500"
                    >
                      删除
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
        <Clock className="w-3 h-3 mr-1 inline-flex" />
        <span>最后访问：{formattedDate}</span>
      </CardFooter>
      
      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </Card>
  )
} 