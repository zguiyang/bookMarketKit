'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Sparkle, Bookmark as BookmarkIcon, MoreHorizontal, Pencil, Trash2, Plus } from 'lucide-react';
import { BookmarkApi, Tag, Category, CreateCategoryReq } from '@/api/bookmark';
import { UserMenu } from './user-menu';
import { toast } from 'sonner';
import { tagColors } from '@/config/tag-colors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { CategoryFormDialog } from '@/components/category/category-form-dialog';
import { TagFormDialog } from '@/components/tag/tag-form-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBookmarkData } from '@/hooks/bookmark-data';

// 视图选择组件
function ViewSection() {
  const router = useRouter();
  const pathname = usePathname();

  const handleViewClick = (view?: string) => {
    if (view) {
      router.push(`/my-bookmarks/${view}`);
    } else {
      router.push('/my-bookmarks');
    }
  };

  return (
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
          className={`flex items-center w-full p-2 rounded-lg text-sm cursor-pointer ${
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
  );
}

// 分类区域组件
function CategorySection() {
  const router = useRouter();
  const pathname = usePathname();

  const [dialogCreateOpen, setDialogCreateOpen] = useState<boolean>(false);
  const [dialogUpdateOpen, setDialogUpdateOpen] = useState<boolean>(false);
  const [categoryRow, setCategoryRow] = useState<Category>({
    id: '',
    name: '',
  });

  const { categories, setCategories, categoriesLoading } = useBookmarkData();

  const handleCategoryClick = (category: Category) => {
    router.push(`/my-bookmarks/category/${category.id}`);
  };

  const handleAddCategory = async (params: CreateCategoryReq) => {
    const { success, data } = await BookmarkApi.createCategory({
      name: params.name,
      description: params.description,
      icon: params.icon,
    });

    if (success) {
      toast.success('分类创建成功');
      setCategories([data, ...categories]);
    }
  };

  const handleUpdateCategory = (data: Category) => {
    setCategoryRow(data);
    setDialogUpdateOpen(true);
  };
  const postEditCategory = async (data: { name: string; icon?: string }) => {
    const res = await BookmarkApi.updateCategory({
      id: categoryRow.id,
      name: data.name,
      icon: data.icon,
    });

    if (res.success && res.data) {
      toast.success('分类更新成功');
      const categoryRowIndex = categories.findIndex((c) => c.id === categoryRow.id);
      if (categoryRowIndex >= 0) {
        const newCategories = [...categories];
        newCategories[categoryRowIndex] = res.data;
        setCategories(newCategories);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { success } = await BookmarkApi.delCategory(id);
    if (success) {
      toast.success('分类删除成功');
      setCategories([...categories.filter((c) => c.id !== id)]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">分类</h2>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          onClick={() => setDialogCreateOpen(true)}
        >
          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </Button>
      </div>

      {categoriesLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">暂无分类</div>
      ) : (
        categories.map((category) => {
          const categoryPath = `/my-bookmarks/category/${category.id}`;
          const isActive = pathname === categoryPath;

          return (
            <div
              key={category.id}
              className={`group flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1 ${
                isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
            >
              <div className="flex-1 flex items-center cursor-pointer" onClick={() => handleCategoryClick(category)}>
                <div className="flex items-center">
                  <span className="mr-2">{category.icon || '📁'}</span>
                  <span
                    className={`text-sm ${
                      isActive ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category.name}
                  </span>
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
                    <DropdownMenuItem onClick={() => handleUpdateCategory(category)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })
      )}

      {/* 新增表单 */}
      <CategoryFormDialog
        open={dialogCreateOpen}
        onUpdateChange={setDialogCreateOpen}
        mode={'create'}
        onSubmitForm={handleAddCategory}
      />
      {/*编辑表单 */}
      <CategoryFormDialog
        open={dialogUpdateOpen}
        onUpdateChange={setDialogUpdateOpen}
        category={categoryRow}
        mode={'edit'}
        onSubmitForm={postEditCategory}
      />
    </div>
  );
}

// 标签区域组件
function TagSection() {
  const router = useRouter();
  const [dialogCreateOpen, setDialogCreateOpen] = useState(false);
  const [dialogUpdateOpen, setDialogUpdateOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | undefined>();

  const { tags, setTags, tagsLoading } = useBookmarkData();

  const handleTagClick = (tag: Tag) => {
    router.push(`/my-bookmarks/tag/${encodeURIComponent(tag.id)}`);
  };

  const handleAddTag = async (values: { name: string; colorIndex: number }) => {
    const { success, data: resData } = await BookmarkApi.createTag({
      name: values.name,
      color: tagColors[values.colorIndex].bg,
    });

    if (success) {
      toast.success('标签创建成功');
      setTags([resData, ...tags]);
    }
  };

  const handleUpdateTag = (tag: Tag) => {
    setTagToEdit(tag);
    setDialogUpdateOpen(true);
  };

  const postEditTag = async (values: { name: string; colorIndex: number }) => {
    const { success, data: resData } = await BookmarkApi.updateTag({
      id: tagToEdit!.id,
      name: values.name,
      color: tagColors[values.colorIndex].bg,
    });

    if (success) {
      toast.success('标签更新成功');
      const tagIndex = tags.findIndex((t) => t.id === tagToEdit!.id);
      if (tagIndex >= 0) {
        const newTags = [...tags];
        newTags[tagIndex] = resData;
        setTags(newTags);
      }
    }
  };

  const handleTagDelete = async (tag: Tag) => {
    const { success } = await BookmarkApi.delTag(tag.id);
    if (success) {
      toast.success('标签删除成功');
      setTags(tags.filter((t) => t.id !== tag.id));
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">标签</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDialogCreateOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tagsLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">暂无标签</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const tagStyle = tag.color
              ? {
                  color: '#FFFFFF',
                  opacity: 0.9,
                }
              : undefined;

            return (
              <ContextMenu key={tag.id}>
                <ContextMenuTrigger>
                  <span
                    style={tagStyle}
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      !tag.color ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : `${tag.color}`
                    } cursor-pointer transition-colors duration-200 hover:opacity-100`}
                    onClick={() => handleTagClick(tag)}
                  >
                    # {tag.name}
                  </span>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-32">
                  <ContextMenuItem onClick={() => handleUpdateTag(tag)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    编辑
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleTagDelete(tag)} className="text-red-500 focus:text-red-500">
                    <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                    删除
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      )}

      {/* 新增标签对话框 */}
      <TagFormDialog
        mode="create"
        open={dialogCreateOpen}
        onOpenChange={setDialogCreateOpen}
        onSubmitForm={handleAddTag}
      />

      {/* 编辑标签对话框 */}
      <TagFormDialog
        mode="edit"
        tag={tagToEdit}
        open={dialogUpdateOpen}
        onOpenChange={setDialogUpdateOpen}
        onSubmitForm={postEditTag}
      />
    </div>
  );
}

// Logo组件
function Logo() {
  return (
    <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
            />
          </svg>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-bold text-gray-900 dark:text-white">BookMarketKit</span>
          <span className="text-[10px] font-medium px-1 py-0.5 rounded-sm bg-primary/15 text-primary">BETA</span>
        </div>
      </div>
    </div>
  );
}

// 主组件
export function SidebarContent() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* Logo */}
      <Logo />

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="w-full h-full">
          {/* 视图选择 */}
          <ViewSection />

          {/* 分类区域 */}
          <CategorySection />

          {/* 标签区域 */}
          <TagSection />
        </ScrollArea>
      </div>

      {/* 用户信息 */}
      <div className="flex-none p-3 border-t border-gray-200 dark:border-gray-700">
        <UserMenu />
      </div>
    </aside>
  );
}
