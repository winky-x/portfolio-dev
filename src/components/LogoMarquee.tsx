"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

const LOGOS: { src: string; alt: string }[] = [
  { src: "https://placehold.co/120x40?text=Next.js", alt: "Next.js" },
  { src: "https://placehold.co/120x40?text=React", alt: "React" },
  { src: "https://placehold.co/120x40?text=TypeScript", alt: "TypeScript" },
  { src: "https://placehold.co/120x40?text=Tailwind", alt: "Tailwind" },
  { src: "https://placehold.co/120x40?text=Three.js", alt: "Three.js" },
  { src: "https://placehold.co/120x40?text=Node.js", alt: "Node.js" },
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
            <Image src={logo.src} alt={logo.alt} width={120} height={40} className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}