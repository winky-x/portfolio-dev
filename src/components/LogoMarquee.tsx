"use client"

import { cn } from "@/lib/utils"

const LOGOS: { name: string; color: string }[] = [
  { name: "Next.js", color: "text-black dark:text-white" },
  { name: "React", color: "text-blue-500" },
  { name: "TypeScript", color: "text-blue-600" },
  { name: "Tailwind CSS", color: "text-cyan-500" },
  { name: "Node.js", color: "text-green-600" },
  { name: "AWS", color: "text-orange-500" },
  { name: "Docker", color: "text-blue-500" },
  { name: "Git", color: "text-orange-600" },
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
            <span className={cn("text-lg font-semibold tracking-wide", logo.color)}>
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}