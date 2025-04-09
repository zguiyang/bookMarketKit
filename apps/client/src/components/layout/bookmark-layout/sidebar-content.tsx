"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Star, Bookmark as BookmarkIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { tagColors, getColorIndexFromName } from "@/config/tag-colors"
import { AddCategoryDialog } from "@/components/category/add-category-dialog"
import { AddTagDialog } from "@/components/tag/add-tag-dialog"

interface Category {
  name: string
  icon: string
  count: number
}

interface Tag {
  name: string
  count: number
}

const mockCategories: Category[] = [
  {
    name: '开发工具',
    icon: '🛠️',
    count: 8
  },
  {
    name: '技术学习',
    icon: '📚',
    count: 12
  },
  {
    name: '设计资源',
    icon: '🎨',
    count: 6
  }
]

const mockTags: (Tag & { colorIndex: number })[] = [
  { name: 'JavaScript', count: 15, colorIndex: 0 },
  { name: 'Vue', count: 12, colorIndex: 1 },
  { name: 'React', count: 8, colorIndex: 2 },
  { name: 'TypeScript', count: 10, colorIndex: 3 },
  { name: 'Python', count: 6, colorIndex: 4 },
  { name: 'Docker', count: 5, colorIndex: 5 },
  { name: 'Git', count: 7, colorIndex: 6 },
  { name: 'CSS', count: 9, colorIndex: 7 }
].map(tag => ({
  ...tag,
  colorIndex: getColorIndexFromName(tag.name)
}))

// 用户资料
const mockUser = {
  name: "张三",
  email: "zhangsan@example.com",
  avatar: "https://github.com/shadcn.png"
}

// 定义视图类型
type ViewType = 'all' | 'starred'

export function SidebarContent() {
  const [categories, setCategories] = useState(mockCategories)
  const [tags, setTags] = useState(mockTags)
  const router = useRouter()
  const pathname = usePathname()

  const handleCategoryClick = (category: Category) => {
    router.push(`/my-bookmarks/category/${encodeURIComponent(category.name)}`)
  }

  const handleTagClick = (tag: Tag) => {
    router.push(`/my-bookmarks/tag/${encodeURIComponent(tag.name)}`)
  }

  const handleViewClick = (view: ViewType) => {
    if (view === 'all') {
      router.push('/my-bookmarks')
    } else if (view === 'starred') {
      router.push('/my-bookmarks/starred')
    }
  }

  const handleEditCategory = (category: Category) => {
    console.log("编辑分类:", category)
    // TODO: 实现编辑分类的逻辑
  }

  const handleDeleteCategory = (category: Category) => {
    console.log("删除分类:", category)
    // TODO: 实现删除分类的逻辑
  }

  const handleTagEdit = (tag: Tag) => {
    console.log("编辑标签:", tag)
    // TODO: 实现标签编辑逻辑
  }

  const handleTagDelete = (tag: Tag) => {
    console.log("删除标签:", tag)
    // TODO: 实现标签删除逻辑
  }

  const handleAddCategory = (values: { name: string; icon: string }) => {
    const newCategory = {
      name: values.name,
      icon: values.icon,
      count: 0
    }
    setCategories([...categories, newCategory])
  }

  const handleAddTag = (newTag: { name: string; colorIndex: number }) => {
    setTags([...tags, { ...newTag, count: 0 }])
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* Logo和产品名称 */}
      <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">📚</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">BookMarketKit</span>
        </div>
      </div>

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 视图选择 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-4">我的书签</h2>
          
          <div className="space-y-1">
            <button
              onClick={() => handleViewClick('all')}
              className={`flex items-center w-full p-2 rounded-lg text-sm ${
                pathname === '/my-bookmarks'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BookmarkIcon className="w-4 h-4 mr-2" />
              全部书签
            </button>
            
            <button
              onClick={() => handleViewClick('starred')}
              className={`flex items-center w-full p-2 rounded-lg text-sm ${
                pathname === '/my-bookmarks/starred'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              收藏夹
            </button>
          </div>
        </div>

        {/* 分类列表 */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">分类</h2>
            <AddCategoryDialog onAddCategory={handleAddCategory} />
          </div>
          
          {categories.map((category, index) => {
            const categoryPath = `/category/${encodeURIComponent(category.name)}`
            const isActive = pathname === categoryPath

            return (
              <div 
                key={index} 
                className={`group flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1 ${
                  isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
              >
                <div 
                  className="flex-1 flex items-center cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{category.icon}</span>
                    <span className={`text-sm ${
                      isActive 
                        ? 'text-gray-900 dark:text-white font-medium' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{category.count}</span>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>

        {/* 标签云 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">标签</h2>
            <AddTagDialog onAddTag={handleAddTag} />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => {
              const colorScheme = tagColors[tag.colorIndex]
              return (
                <ContextMenu key={index}>
                  <ContextMenuTrigger>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorScheme.bg} ${colorScheme.text} ${colorScheme.hover} cursor-pointer transition-colors duration-200`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag.name}
                      <span className="ml-1 opacity-75">{tag.count}</span>
                    </span>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-32">
                    <ContextMenuItem onClick={() => handleTagEdit(tag)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      编辑
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => handleTagDelete(tag)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )
            })}
          </div>
        </div>
      </div>

      {/* 用户信息 */}
      <div className="flex-none p-3 border-t border-gray-200 dark:border-gray-700">
        <UserMenu user={mockUser} />
      </div>
    </aside>
  )
} 