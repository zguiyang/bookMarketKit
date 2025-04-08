"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Settings, 
  User, 
  SearchIcon,
  Bookmark,
  Star
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Bookmark as BookmarkType } from "@/types/bookmark"

interface CommandMenuProps {
  bookmarks: BookmarkType[]
}

export function CommandMenu({ bookmarks }: CommandMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (callback: () => void) => {
    callback()
    setOpen(false)
  }

  const navigateToBookmark = (url: string) => {
    window.open(url, "_blank")
  }

  const bookmarksByCategory = bookmarks.reduce((acc, bookmark) => {
    const category = bookmark.category || "未分类"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(bookmark)
    return acc
  }, {} as Record<string, BookmarkType[]>)

  const starredBookmarks = bookmarks.filter((bookmark) => bookmark.starred)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-lg border border-input bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4" />
          <span>搜索书签...</span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="搜索书签、分类或标签..." />
        <CommandList>
          <CommandEmpty>未找到相关书签</CommandEmpty>
          
          {starredBookmarks.length > 0 && (
            <CommandGroup heading="收藏书签">
              {starredBookmarks.map((bookmark) => (
                <CommandItem
                  key={bookmark.id}
                  onSelect={() => handleSelect(() => navigateToBookmark(bookmark.url))}
                >
                  <div className="flex items-center">
                    {bookmark.icon ? (
                      <img 
                        src={bookmark.icon} 
                        alt="" 
                        className="mr-2 h-4 w-4"
                      />
                    ) : (
                      <Bookmark className="mr-2 h-4 w-4" />
                    )}
                    <span>{bookmark.title}</span>
                  </div>
                  <CommandShortcut>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {Object.entries(bookmarksByCategory).map(([category, categoryBookmarks]) => (
            <CommandGroup key={category} heading={category}>
              {categoryBookmarks.map((bookmark) => (
                <CommandItem
                  key={bookmark.id}
                  onSelect={() => handleSelect(() => navigateToBookmark(bookmark.url))}
                >
                  <div className="flex items-center">
                    {bookmark.icon ? (
                      <img 
                        src={bookmark.icon} 
                        alt="" 
                        className="mr-2 h-4 w-4"
                      />
                    ) : (
                      <Bookmark className="mr-2 h-4 w-4" />
                    )}
                    <span>{bookmark.title}</span>
                  </div>
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {bookmark.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="设置">
            <CommandItem
              onSelect={() => handleSelect(() => router.push("/settings/profile"))}
            >
              <User className="mr-2 h-4 w-4" />
              <span>个人资料</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => router.push("/settings"))}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>设置</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 