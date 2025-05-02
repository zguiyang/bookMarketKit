import { AuthProvider } from '@/components/providers/auth-provider';
import { BookmarkLayout } from "@/components/layout/bookmark-layout"

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <AuthProvider>
         <BookmarkLayout>{children}</BookmarkLayout>
      </AuthProvider>
  )
} 