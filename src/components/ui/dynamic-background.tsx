'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DynamicBackgroundProps {
  className?: string
  intensity?: number
  speed?: number
  colors?: string[]
  pattern?: 'gradient' | 'mesh' | 'waves' | 'particles'
}

export function DynamicBackground({
  className,
  intensity = 1.0,
  speed = 1.0,
  colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'],
  pattern = 'gradient',
}: DynamicBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const renderPattern = () => {
    switch (pattern) {
      case 'gradient':
        return (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors[0]}20, ${colors[1]}15, ${colors[2]}10, transparent 70%)`,
            }}
            animate={{
              background: [
                `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors[0]}20, ${colors[1]}15, ${colors[2]}10, transparent 70%)`,
                `radial-gradient(circle at ${(mousePosition.x + 0.1) * 100}% ${(mousePosition.y + 0.1) * 100}%, ${colors[1]}20, ${colors[2]}15, ${colors[3]}10, transparent 70%)`,
                `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors[0]}20, ${colors[1]}15, ${colors[2]}10, transparent 70%)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )

      case 'mesh':
        return (
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="mesh" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.1"
                    opacity="0.1"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#mesh)" />
            </svg>
          </div>
        )

      case 'waves':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(45deg, ${colors[i % colors.length]}10, transparent)`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 4 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        )

      case 'particles':
        return (
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ y, opacity, scale }}
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colors[0]}05, ${colors[1]}05, ${colors[2]}05, ${colors[3]}05)`,
        }}
      />

      {/* Dynamic pattern */}
      {renderPattern()}

      {/* Moving orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors[0]}20, transparent 70%)`,
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors[1]}20, transparent 70%)`,
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10">{/* Content goes here */}</div>
    </motion.div>
  )
}

// Enhanced version with more effects
export function UltraDynamicBackground({
  className,
  ...props
}: DynamicBackgroundProps) {
  return (
    <div className={cn('relative', className)}>
      <DynamicBackground {...props} />
      
      {/* Additional floating elements */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/30 rounded-full"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay">
        <div className="w-full h-full bg-noise" />
      </div>
    </div>
  )
}