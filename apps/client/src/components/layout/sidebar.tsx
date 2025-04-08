"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { UserMenu } from "@/components/user-menu"

interface Category {
  name: string
  icon: string
  count: number
  expanded: boolean
  subcategories: {
    name: string
    count: number
  }[]
}

interface Tag {
  name: string
  count: number
}

const mockCategories = [
  {
    name: '开发工具',
    icon: '🛠️',
    count: 8,
    expanded: true,
    subcategories: [
      { name: 'IDE & 编辑器', count: 3 },
      { name: '版本控制', count: 2 },
      { name: '文档工具', count: 3 }
    ]
  },
  {
    name: '技术学习',
    icon: '📚',
    count: 12,
    expanded: false,
    subcategories: [
      { name: '官方文档', count: 5 },
      { name: '教程博客', count: 4 },
      { name: '视频课程', count: 3 }
    ]
  },
  {
    name: '设计资源',
    icon: '🎨',
    count: 6,
    expanded: false,
    subcategories: [
      { name: 'UI/UX', count: 2 },
      { name: '素材库', count: 2 },
      { name: '配色工具', count: 2 }
    ]
  }
]

const mockTags = [
  { name: 'JavaScript', count: 15 },
  { name: 'Vue', count: 12 },
  { name: 'React', count: 8 },
  { name: 'TypeScript', count: 10 },
  { name: 'Python', count: 6 },
  { name: 'Docker', count: 5 },
  { name: 'Git', count: 7 },
  { name: 'CSS', count: 9 }
]

// 模拟用户数据
const mockUser = {
  name: "Joy Zhao",
  email: "joy@example.com",
  avatar: ""
}

export function Sidebar() {
  const [categories, setCategories] = useState(mockCategories)

  const handleCategoryClick = (category: Category) => {
    setCategories(categories.map(cat => 
      cat.name === category.name ? { ...cat, expanded: !cat.expanded } : cat
    ))
  }

  const handleTagClick = (tag: Tag) => {
    console.log("Tag clicked:", tag)
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* Logo和产品名称 */}
      <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">📚</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">BookMind</span>
        </div>
      </div>

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 分类列表 */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">分类</h2>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {categories.map((category, index) => (
            <div key={index} className="mb-2">
              <div 
                className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{category.count}</span>
              </div>
              {category.expanded && (
                <div className="ml-8 space-y-1">
                  {category.subcategories.map((sub, subIndex) => (
                    <div 
                      key={subIndex}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-400">{sub.name}</span>
                      <span className="text-xs text-gray-500">{sub.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 标签云 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">标签</h2>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => handleTagClick(tag)}
              >
                {tag.name}
                <span className="ml-1 text-gray-500 dark:text-gray-400">{tag.count}</span>
              </span>
            ))}
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