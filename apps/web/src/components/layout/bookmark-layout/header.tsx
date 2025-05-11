import { Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SidebarContent } from "./sidebar-content"
import {CommandMenu} from "./command-menu";

interface HeaderProps {
  onAddBookmark: () => void
}

export function Header({ onAddBookmark }: HeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="flex h-16 items-center px-4 md:px-8">
        {/* 移动端侧边栏控制按钮 */}
        <wediv className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "px-2 text-base hover:bg-transparent hover:opacity-75",
                  "focus-visible:ring-0 focus-visible:ring-offset-0"
                )}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0 [&>button]:hidden">
              <SheetHeader className="sr-only">
                <SheetTitle>书签导航菜单</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </wediv>

        <div className="flex-1 flex items-center space-x-4">
          <div className="flex-1 relative">
            <CommandMenu />
          </div>
          <Button onClick={onAddBookmark}>
            <Plus className="w-5 h-5" />
            <span>新增书签</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 