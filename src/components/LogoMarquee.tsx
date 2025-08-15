"use client"

import Image from "next/image"

const LOGOS: { src: string; alt: string }[] = [
  { src: "https://placehold.co/120x40?text=Next.js", alt: "Next.js" },
  { src: "https://placehold.co/120x40?text=React", alt: "React" },
  { src: "https://placehold.co/120x40?text=TypeScript", alt: "TypeScript" },
  { src: "https://placehold.co/120x40?text=Tailwind", alt: "Tailwind" },
  { src: "https://placehold.co/120x40?text=Three.js", alt: "Three.js" },
  { src: "https://placehold.co/120x40?text=Node.js", alt: "Node.js" },
]

export function LogoMarquee() {
  const items = [...LOGOS, ...LOGOS]
  return (
    <div className="marquee py-8 special-highlight/40 rounded-xl border border-border/40">
      <div className="marquee-track">
        {items.map((logo, i) => (
          <div key={i} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <Image src={logo.src} alt={logo.alt} width={120} height={40} className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}