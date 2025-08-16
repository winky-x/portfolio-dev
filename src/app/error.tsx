'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold">Something went wrong!</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left text-sm text-muted-foreground bg-muted p-4 rounded-lg">
            <summary className="cursor-pointer font-medium mb-2">Error Details (Development)</summary>
            <pre className="whitespace-pre-wrap break-words">{error.message}</pre>
            <pre className="whitespace-pre-wrap break-words mt-2">{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  )
}