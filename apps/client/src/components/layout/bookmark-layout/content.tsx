import { ReactNode } from "react"

interface ContentProps {
  children: ReactNode
}

export function Content({ children }: ContentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {children}
    </div>
  )
} 