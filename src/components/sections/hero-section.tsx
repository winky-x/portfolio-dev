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
    <section ref={sectionRef} className="relative w-full h-[100vh] overflow-hidden bg-white dark:bg-black">
      {/* Simple background for debugging */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black" />

      {/* Foreground content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="pointer-events-none">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter leading-tight text-black dark:text-white">
            Creative Developer & Digital Artisan
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-center text-lg md:text-xl text-black/80 dark:text-white/80">
            Crafting beautiful, interactive, and performant web experiences to bring your ideas to life.
            </p>
            {/* Debug text */}
            <p className="mt-4 text-sm text-red-500">DEBUG: Hero text is rendering</p>
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
