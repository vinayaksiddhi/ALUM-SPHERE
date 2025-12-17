import DashboardLayout from "@/components/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchLoading() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="flex-1 h-12" />
          <Skeleton className="w-[180px] h-12" />
          <Skeleton className="w-[120px] h-12" />
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
