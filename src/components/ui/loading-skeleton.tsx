import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  count?: number
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-muted rounded" />
          <div className="h-3 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-48 bg-muted rounded-t-lg" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full w-16" />
          <div className="h-6 bg-muted rounded-full w-20" />
        </div>
      </div>
    </div>
  )
}

export function ProjectSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-muted rounded-lg" />
      <div className="mt-4 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="flex gap-2">
          <div className="h-5 bg-muted rounded-full w-16" />
          <div className="h-5 bg-muted rounded-full w-20" />
          <div className="h-5 bg-muted rounded-full w-14" />
        </div>
      </div>
    </div>
  )
}