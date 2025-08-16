"use client"

import { cn } from "@/lib/utils"

const LOGOS: { name: string; fontClass: string; gradient: string }[] = [
  { name: "Next.js", fontClass: "font-nextjs", gradient: "bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent" },
  { name: "React", fontClass: "font-react", gradient: "bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent" },
  { name: "TypeScript", fontClass: "font-typescript", gradient: "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent" },
  { name: "Tailwind CSS", fontClass: "font-tailwind", gradient: "bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-600 bg-clip-text text-transparent" },
  { name: "Node.js", fontClass: "font-nodejs", gradient: "bg-gradient-to-r from-green-600 via-green-500 to-green-700 bg-clip-text text-transparent" },
  { name: "AWS", fontClass: "font-aws", gradient: "bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 bg-clip-text text-transparent" },
  { name: "Docker", fontClass: "font-docker", gradient: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent" },
  { name: "Git", fontClass: "font-git", gradient: "bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 bg-clip-text text-transparent" },
]

export function LogoMarquee({ className = "" }: { className?: string }) {
  const items = [...LOGOS, ...LOGOS]
  return (
    <div className={cn("marquee group py-6 rounded-xl border border-border/40 bg-transparent", className)} style={{ ['--marquee-duration' as any]: '24s' }}>
      <div className="absolute inset-y-0 left-0 w-16 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-16 pointer-events-none bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track group-hover:[animation-duration:calc(var(--marquee-duration)*1.8)]">
        {items.map((logo, i) => (
          <div key={i} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <span className={cn("text-xl font-bold tracking-wide", logo.fontClass, logo.gradient)}>
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}