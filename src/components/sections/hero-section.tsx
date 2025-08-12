'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { LiquidHeroBlob } from '@/components/3d/LiquidHeroBlob'
import { ContactSection } from './contact-section'

export function HeroSection() {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="pointer-events-none">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter leading-tight">
            Creative Developer & Digital Artisan
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground">
            Crafting beautiful, interactive, and performant web experiences to bring your ideas to life.
            </p>
        </div>
        <div className="w-full max-w-2xl mt-8 pointer-events-auto">
            <ContactSection />
        </div>
      </div>
      <Canvas>
        <Suspense fallback={null}>
          <LiquidHeroBlob />
        </Suspense>
      </Canvas>
    </section>
  )
}
