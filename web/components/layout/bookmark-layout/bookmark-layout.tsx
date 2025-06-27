'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequest } from 'alova/client';
import type { FormValues } from '@/components/bookmark/bookmark-form';
import { BookmarkForm } from '@/components/bookmark/bookmark-form';
import { BookmarkImportDialog } from '@/components/bookmark/bookmark-import-dialog';
import { BookmarkApi } from '@/api';
import { downloadFile } from '@/lib/utils';
import { client } from '@/lib/auth/client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { Content } from './content';

export interface BookmarkLayoutProps {
  children: ReactNode;
}

export function BookmarkLayout({ children }: BookmarkLayoutProps) {
  const router = useRouter();
  const { data: session, isPending } = client.useSession();

  const [refreshKey, setRefreshKey] = useState(0);

  const [showAddBookmarkForm, setShowAddBookmarkForm] = useState(false);
  const [showImportBookmarkDialog, setShowImportBookmarkDialog] = useState(false);
  const { send: postCreateBookmark } = useRequest(BookmarkApi.create, {
    immediate: false,
  });

  const handleAddBookmark = () => {
    setShowAddBookmarkForm(true);
  };

  const handleSubmitBookmark = async (values: FormValues) => {
    const { success } = await postCreateBookmark({
      title: values.title,
      url: values.url,
      icon: values.icon,
      tagIds: values.tagIds,
      categoryIds: values.categoryIds,
    });
    if (success) {
      setShowAddBookmarkForm(false);
      setRefreshKey((prev) => prev + 1);
    }
  };

  const handleImportBookmark = () => {
    setShowImportBookmarkDialog(true);
  };

  const handleExportBookmark = async () => {
    const result = await BookmarkApi.export();
    if (result.success) {
      downloadFile(result.data.file, result.data.name);
    }
  };

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth/sign-in');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-muted animate-pulse"></div>
          <div className="absolute inset-2 rounded-full border-t-4 border-primary animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-foreground animate-pulse">加载中...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-4 text-lg font-medium text-foreground transition-opacity duration-1000 animate-pulse">跳转中...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          onAddBookmark={handleAddBookmark}
          onImportBookmark={handleImportBookmark}
          onExportBookmark={handleExportBookmark}
        />
        <Content key={refreshKey}>{children}</Content>
        <BookmarkForm
          mode="create"
          open={showAddBookmarkForm}
          onOpenChange={setShowAddBookmarkForm}
          onSubmit={handleSubmitBookmark}
        />
        <BookmarkImportDialog open={showImportBookmarkDialog} onOpenChange={setShowImportBookmarkDialog} />
      </main>
    </div>
  );
}
