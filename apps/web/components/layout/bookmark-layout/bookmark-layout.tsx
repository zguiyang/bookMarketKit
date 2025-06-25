'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequest } from 'alova/client';
import { BookmarkForm, FormValues } from '@/components/bookmark/bookmark-form';
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
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">跳转中...</div>;
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
