import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Need help? <Link href="/#contact" className="text-primary hover:underline">Contact me</Link>
          </p>
        </div>
      </div>
    </div>
  )
}