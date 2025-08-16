import { LoadingSkeleton } from '@/components/ui/loading-skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="h-14 bg-muted rounded-lg" />
        
        {/* Hero section skeleton */}
        <div className="h-[60vh] bg-muted rounded-lg" />
        
        {/* Content skeletons */}
        <div className="space-y-12">
          <LoadingSkeleton count={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LoadingSkeleton count={2} />
            <LoadingSkeleton count={2} />
          </div>
          <LoadingSkeleton count={2} />
        </div>
      </div>
    </div>
  )
}