import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function StatCardSkeleton() {
  return (
    <Card className="w-full rounded-[40px] border-none bg-slate-50/50 p-6">
      <CardContent className="p-0">
        {/* Top Row */}
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-2">
            {/* Title: Biens */}
            <Skeleton className="h-7 w-24 rounded-md" />
            {/* Title: Totaux */}
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>
          {/* Circular Button */}
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-end">
          {/* Big Number: 142 */}
          <Skeleton className="h-10 w-20 rounded-md" />
          
          {/* Trend: +8.23% */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}