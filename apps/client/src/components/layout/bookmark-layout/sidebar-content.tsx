"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Heart, Sparkle, Bookmark as BookmarkIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useRequest } from 'alova/client'
import { BookmarkApi, Tag, Category } from '@/api/bookmark'
import { UserMenu } from "./user-menu"
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
import { AddCategoryDialog } from "@/components/category/add-category-dialog"
import { AddTagDialog } from "@/components/tag/add-tag-dialog"

export function SidebarContent() {
  const router = useRouter()
  const pathname = usePathname()

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const { onSuccess: onSuccessCategories } = useRequest(BookmarkApi.categories);
  const { onSuccess: onSuccessTags } = useRequest(BookmarkApi.tags);

  onSuccessCategories(({data:res}) => {
    if (res.success && res.data) {
      setCategories(res.data)
    }
  })

  onSuccessTags(({data:res}) => {
    if (res.success && res.data) {
      setTags(res.data)
    }
  })

  const handleCategoryClick = (category: Category) => {
    router.push(`/my-bookmarks/category/${category.id}`)
  }

  const handleTagClick = (tag: Tag) => {
    router.push(`/my-bookmarks/tag/${encodeURIComponent(tag.id)}`)
  }

  const handleViewClick = (view?: string) => {
    if (view) {
      router.push(`/my-bookmarks/${view}`)
    } else {
      router.push('/my-bookmarks')
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

  const handleAddCategory = () => {
   // do something
  }

  const handleAddTag = () => {
   // do something
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
                onClick={() => handleViewClick()}
                className={`flex items-center w-full p-2 rounded-lg text-sm cursor-pointer ${
                    pathname === '/my-bookmarks'
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Sparkle className="w-4 h-4 mr-2 text-primary" />
              快捷访问
            </button>
            <button
              onClick={() => handleViewClick('all')}
              className={`flex items-center w-full p-2 rounded-lg text-sm cursor-pointer ${
                pathname === '/my-bookmarks/all'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BookmarkIcon className="w-4 h-4 mr-2" />
              所有书签
            </button>
            
            <button
              onClick={() => handleViewClick('favorite')}
              className={`flex items-center w-full p-2 rounded-lg text-sm  cursor-pointer ${
                pathname === '/my-bookmarks/favorite'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              最喜欢的
            </button>
          </div>
        </div>

        {/* 分类列表 */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">分类</h2>
            <AddCategoryDialog onAddCategory={handleAddCategory} />
          </div>
          
          {categories.map((category) => {
            const categoryPath = `/category/${encodeURIComponent(category.name)}`
            const isActive = pathname === categoryPath

            return (
              <div 
                key={category.id}
                className={`group flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1 ${
                  isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
              >
                <div 
                  className="flex-1 flex items-center cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{category.icon || '📁'}</span>
                    <span className={`text-sm ${
                      isActive 
                        ? 'text-gray-900 dark:text-white font-medium' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>{category.name}</span>
                  </div>
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
                        <Trash2 className="w-4 h-4 mr-2 text-red-500" />
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
            {tags.map((tag) => {
              const tagStyle = tag.color ? {
                backgroundColor: tag.color,
                color: '#FFFFFF',  // 使用白色文本以确保在彩色背景上可读
                opacity: 0.9,
              } : undefined;

              return (
                <ContextMenu key={tag.id}>
                  <ContextMenuTrigger>
                    <span
                      style={tagStyle}
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        !tag.color ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''
                      } cursor-pointer transition-colors duration-200 hover:opacity-100`}
                      onClick={() => handleTagClick(tag)}
                    >
                      # {tag.name}
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
                      <Trash2 className="w-4 h-4 mr-2 text-red-500" />
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
        <UserMenu />
      </div>
    </aside>
  )
} 