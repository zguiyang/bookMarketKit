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
        "flex min-h-[50px] sm:min-h-[120px] md:min-h-[160px] lg:min-h-[200px] xl:min-h-[250px] 2xl:min-h-[300px]",
        "flex-col items-center justify-center",
        "rounded-md border border-dashed border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-gray-950",
        "p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6",
        "text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className={cn(
        "mx-auto flex w-full flex-col items-center justify-center text-center",
        "max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px]"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-full",
          "bg-gray-100/30 dark:bg-gray-800/30",
          "mb-1.5 sm:mb-2 md:mb-3",
          "h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14"
        )}>
          <Icon className={cn(
            "text-gray-400 dark:text-gray-500",
            "h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7"
          )} />
        </div>
        <h3 className={cn(
          "font-semibold text-gray-900 dark:text-gray-100",
          "mt-1.5 sm:mt-2 md:mt-2.5",
          "text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
        )}>
          {title}
        </h3>
        {description && (
          <p className={cn(
            "text-gray-500 dark:text-gray-400",
            "mt-1 sm:mt-1.5",
            "px-2 sm:px-3 md:px-4",
            "text-xs sm:text-xs md:text-sm lg:text-base"
          )}>
            {description}
          </p>
        )}
        {children && (
          <div className={cn(
            "w-full",
            "mt-2 sm:mt-2.5 md:mt-3"
          )}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
} 