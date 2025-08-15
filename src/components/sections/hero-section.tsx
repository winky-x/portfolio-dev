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
      {/* Liquid cursor overlay */}
      <LiquidCursor containerRef={sectionRef} intensity={0.4} trail={6} />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="pointer-events-none">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter leading-tight">
            Creative Developer & Digital Artisan
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-center text-lg md:text-xl text-foreground/80">
            Crafting beautiful, interactive, and performant web experiences to bring your ideas to life.
            </p>
        </div>
        <div className="w-full max-w-2xl mt-8 pointer-events-auto">
            <ContactSection />
        </div>
      </div>

      {/* Bottom logo marquee */}
      <div className="absolute left-0 right-0 bottom-4 z-10 px-6">
        <LogoMarquee className="w-full" />
      </div>

      <Canvas>
        <Suspense fallback={null}>
          <LiquidHeroBlob />
        </Suspense>
      </Canvas>
    </section>
  )
}
