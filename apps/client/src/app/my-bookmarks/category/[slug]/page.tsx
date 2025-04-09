'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = decodeURIComponent(params.slug as string)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title={`分类：${categorySlug}`}
          description="查看此分类下的所有书签"
        />
        {/* 这里后续可以添加书签列表组件 */}
        <div className="grid gap-4">
          {/* BookmarkList组件将在这里添加 */}
        </div>
      </div>
    </div>
  )
} 