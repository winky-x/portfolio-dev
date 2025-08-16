'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { LiquidHeroBlob } from '@/components/3d/LiquidHeroBlob'
import { ContactSection } from './contact-section'
import { LiquidCursor } from '@/components/effects/LiquidCursor'
import { LogoMarquee } from '@/components/LogoMarquee'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  return (
    <section ref={sectionRef} className="relative w-full h-[100vh] overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-black dark:to-black" />
      
      {/* Liquid cursor overlay */}
      <LiquidCursor containerRef={sectionRef} intensity={0.6} trail={6} />

      {/* Foreground content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="pointer-events-none">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline tracking-tighter leading-tight text-black dark:text-white drop-shadow-lg">
            Full-Stack Developer & UI/UX Designer
            </h1>
            <p className="mt-6 max-w-4xl mx-auto text-center text-xl md:text-2xl text-black/90 dark:text-white/90 font-medium leading-relaxed">
            Building modern web applications with cutting-edge technologies. Specializing in React, Next.js, and cloud solutions.
            </p>
        </div>
        <div className="w-full max-w-2xl mt-8 pointer-events-auto">
            <ContactSection />
        </div>
      </div>

      {/* Bottom logo marquee */}
      <div className="absolute left-0 right-0 bottom-4 z-30 px-6">
        <LogoMarquee className="w-full" />
      </div>
    </section>
  )
}
