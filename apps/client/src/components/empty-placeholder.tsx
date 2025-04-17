import { FileQuestion } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
  className?: string
}

export function EmptyPlaceholder({
  icon: Icon = FileQuestion,
  title = "暂无数据",
  description = "当前暂无相关数据展示",
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed border-gray-200 bg-white p-8 text-center animate-in fade-in-50 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100/30 dark:bg-gray-800/30 mb-4">
          <Icon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
} 