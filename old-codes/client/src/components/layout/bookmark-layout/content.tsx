import { ReactNode } from "react"
import {ScrollArea} from "@/components/ui/scroll-area";

interface ContentProps {
  children: ReactNode
}

export function Content({ children }: ContentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea className="h-full w-full">
        {children}
      </ScrollArea>
    </div>
  )
} 