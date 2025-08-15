import { Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6"><rect width="256" height="256" fill="none"></rect><path d="M139.2,208.8a104,104,0,0,1-106.4-90.4H24a8,8,0,0,1,0-16H32.8a104,104,0,0,1,190.4,0H232a8,8,0,0,1,0,16h-8.8A103.5,103.5,0,0,1,139.2,208.8Z" className="fill-foreground"></path></svg>
          <p className="text-center text-sm leading-loose md:text-left text-muted-foreground">
            Built with Next.js, React, and Tailwind CSS.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com/username" target="_blank" aria-label="GitHub Profile"><Github/></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://linkedin.com/in/username" target="_blank" aria-label="LinkedIn Profile"><Linkedin/></Link>
            </Button>
             <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com/username" target="_blank" aria-label="Twitter Profile"><Twitter/></Link>
            </Button>
        </div>
      </div>
    </footer>
  )
}
