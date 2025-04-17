import { cn } from "@/lib/utils"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationListProps {
    currentPage: number
    totalPages: number
    isLoading?: boolean
    onPageChange: (page: number) => void
}

export function PaginationList({
    currentPage,
    totalPages,
    isLoading = false,
    onPageChange
}: PaginationListProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-8 flex justify-center">
            <Pagination>
                <PaginationContent className="flex items-center gap-1">
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => !isLoading && onPageChange(currentPage - 1)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
                                currentPage <= 1 || isLoading 
                                    ? "pointer-events-none opacity-50" 
                                    : "cursor-pointer hover:bg-muted"
                            )}
                        >
                            上一页
                        </PaginationPrevious>
                    </PaginationItem>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                onClick={() => !isLoading && onPageChange(pageNum)}
                                isActive={currentPage === pageNum}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
                                    isLoading 
                                        ? "pointer-events-none opacity-50" 
                                        : "cursor-pointer hover:bg-muted",
                                    currentPage === pageNum && "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => !isLoading && onPageChange(currentPage + 1)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
                                currentPage >= totalPages || isLoading 
                                    ? "pointer-events-none opacity-50" 
                                    : "cursor-pointer hover:bg-muted"
                            )}
                        >
                            下一页
                        </PaginationNext>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
} 