import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface BookmarkSkeletonProps {
  count?: number;
}

export function BookmarkSkeleton({ count = 1 }: BookmarkSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5 mt-2" />
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
} 