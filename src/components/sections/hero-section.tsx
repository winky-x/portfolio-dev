'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { LiquidHeroBlob } from '@/components/3d/LiquidHeroBlob'
import { ContactSection } from './contact-section'
import { LiquidCursor } from '@/components/effects/LiquidCursor'
import { LogoMarquee } from '@/components/LogoMarquee'
import { AnimatedEntrance, StaggeredContainer, StaggeredItem } from '@/components/ui/animated-entrance'
import { FloatingParticles } from '@/components/3d/FloatingParticles'
import { DynamicBackground } from '@/components/ui/dynamic-background'
import { PremiumCard } from '@/components/ui/premium-card'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  return (
    <section id="hero" ref={sectionRef} className="relative w-full h-[100vh] overflow-hidden">
      {/* Enhanced dynamic background */}
      <DynamicBackground
        pattern="gradient"
        colors={['#6366f1', '#8b5cf6', '#06b6d4', '#10b981']}
        intensity={0.8}
        speed={1.2}
      />
      
      {/* 3D floating particles */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <FloatingParticles count={80} intensity={0.6} />
        </Canvas>
      </div>
      
      {/* Liquid cursor overlay */}
      <LiquidCursor containerRef={sectionRef} intensity={0.6} trail={6} />

      {/* Foreground content with animations */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4">
        <StaggeredContainer stagger={0.2} delay={0.5}>
          <StaggeredItem direction="up" distance={60}>
            <div className="pointer-events-none">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline tracking-tighter leading-tight text-black dark:text-white drop-shadow-lg">
                Full-Stack Developer & UI/UX Designer
              </h1>
            </div>
          </StaggeredItem>
          
          <StaggeredItem direction="up" distance={40} delay={0.3}>
            <p className="mt-6 max-w-4xl mx-auto text-center text-xl md:text-2xl text-black/90 dark:text-white/90 font-medium leading-relaxed">
              Building modern web applications with cutting-edge technologies. Specializing in React, Next.js, and cloud solutions.
            </p>
          </StaggeredItem>
          
          <StaggeredItem direction="up" distance={30} delay={0.6}>
            <div className="w-full max-w-2xl mt-8 pointer-events-auto">
              <PremiumCard
                className="backdrop-blur-sm bg-white/20 dark:bg-black/20 border-white/30"
                neonColor="#6366f1"
                glow={true}
                tilt={true}
              >
                <ContactSection />
              </PremiumCard>
            </div>
          </StaggeredItem>
        </StaggeredContainer>
      </div>
      
      {/* Bottom logo marquee with animation */}
      <AnimatedEntrance direction="up" distance={30} delay={1.0}>
        <div className="absolute left-0 right-0 bottom-4 z-30 px-6">
          <LogoMarquee className="w-full" />
        </div>
      </AnimatedEntrance>
    </section>
  )
}
