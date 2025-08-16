import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6"><rect width="256" height="256" fill="none"></rect><path d="M139.2,208.8a104,104,0,0,1-106.4-90.4H24a8,8,0,0,1,0-16H32.8a104,104,0,0,1,190.4,0H232a8,8,0,0,1,0,16h-8.8A103.5,103.5,0,0,1,139.2,208.8Z" className="fill-foreground"></path></svg>
            <span className="font-bold font-headline">
              Fluxfolio
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
           <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#projects" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Projects
            </Link>
            <Link href="#experience" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Experience
            </Link>
             <Link href="#integrations" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Activity
            </Link>
          </nav>
          <div className="flex-1 md:flex-none md:w-auto"></div>
          <nav className="flex items-center gap-1">
            <ThemeToggle />
            <Button asChild className="ml-2 hidden sm:inline-flex">
              <Link href="#contact">Hire Me</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
