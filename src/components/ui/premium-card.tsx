'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  neonColor?: string
  intensity?: number
  blur?: number
  scale?: boolean
  tilt?: boolean
  glow?: boolean
}

export function PremiumCard({
  children,
  className,
  neonColor = '#6366f1',
  intensity = 0.8,
  blur = 20,
  scale = true,
  tilt = true,
  glow = true,
}: PremiumCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15])

  const springConfig = { damping: 20, stiffness: 300 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseXFromCenter = e.clientX - centerX
    const mouseYFromCenter = e.clientY - centerY

    mouseX.set(mouseXFromCenter / (rect.width / 2))
    mouseY.set(mouseYFromCenter / (rect.height / 2))

    setMousePosition({ x: mouseXFromCenter, y: mouseYFromCenter })
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'backdrop-blur-md border border-white/20',
        'bg-white/10 dark:bg-black/20',
        'transition-all duration-500 ease-out',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={
        tilt
          ? {
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }
          : {}
      }
      animate={{
        scale: scale && isHovered ? 1.02 : 1,
        boxShadow: isHovered
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)`
          : `0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)`,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, ${neonColor}20 0%, transparent 50%)`
            : 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Neon border effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(45deg, ${neonColor}40, transparent, ${neonColor}40)`,
            opacity: isHovered ? 0.3 : 0,
          }}
          animate={{
            boxShadow: isHovered
              ? `0 0 20px ${neonColor}80, inset 0 0 20px ${neonColor}20`
              : '0 0 0px transparent, inset 0 0 0px transparent',
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content with 3D transform */}
      <motion.div
        className="relative z-10 p-6"
        style={
          tilt
            ? {
                transform: 'translateZ(50px)',
                rotateX: springRotateX,
                rotateY: springRotateY,
              }
            : {}
        }
      >
        {children}
      </motion.div>

      {/* Floating particles overlay */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
          <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-100" />
          <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse delay-200" />
        </motion.div>
      )}

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay">
        <div className="w-full h-full bg-noise" />
      </div>
    </motion.div>
  )
}

// Enhanced version with more effects
export function UltraPremiumCard({
  children,
  className,
  neonColor = '#6366f1',
  ...props
}: PremiumCardProps) {
  return (
    <div className="group">
      <PremiumCard
        className={cn(
          'relative',
          'before:absolute before:inset-0 before:rounded-2xl',
          'before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent',
          'before:opacity-0 before:transition-opacity before:duration-700',
          'hover:before:opacity-100',
          'after:absolute after:inset-0 after:rounded-2xl',
          'after:bg-gradient-to-b after:from-transparent after:via-white/5 after:to-transparent',
          'after:opacity-0 after:transition-opacity after:duration-700',
          'hover:after:opacity-100',
          className
        )}
        neonColor={neonColor}
        {...props}
      >
        {children}
      </PremiumCard>
    </div>
  )
}