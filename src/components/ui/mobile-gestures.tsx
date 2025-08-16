'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, PanInfo, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SwipeableCardProps {
  children: React.ReactNode
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  resistance?: number
}

export function SwipeableCard({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 100,
  resistance = 0.8,
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const scale = useTransform(x, [-200, 200], [0.95, 1.05])

  const handleDragStart = () => setIsDragging(true)
  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    
    const { offset, velocity } = info
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 && onSwipeRight) onSwipeRight()
      if (offset.x < 0 && onSwipeLeft) onSwipeLeft()
    }
    
    if (Math.abs(offset.y) > threshold || Math.abs(velocity.y) > 500) {
      if (offset.y > 0 && onSwipeDown) onSwipeDown()
      if (offset.y < 0 && onSwipeUp) onSwipeUp()
    }
    
    // Reset position
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={cn('touch-none cursor-grab active:cursor-grabbing', className)}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={resistance}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, scale }}
      whileDrag={{ scale: 1.05 }}
    >
      {children}
    </motion.div>
  )
}

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  className?: string
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && startY.current > 0) {
      currentY.current = e.touches[0].clientY
      const distance = Math.max(0, currentY.current - startY.current)
      setPullDistance(distance * 0.5) // Add resistance
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setPullDistance(0)
    startY.current = 0
    currentY.current = 0
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance, threshold, onRefresh])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gradient-to-b from-blue-500/20 to-transparent"
        style={{ height: Math.min(pullDistance, threshold) }}
        animate={{ opacity: pullDistance > 0 ? 1 : 0 }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: pullDistance > threshold ? 360 : 0 }}
          transition={{ duration: 0.5, repeat: isRefreshing ? Infinity : 0 }}
        />
      </motion.div>

      {/* Content */}
      <div
        ref={containerRef}
        className="h-full overflow-auto"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  )
}

interface TouchRippleProps {
  children: React.ReactNode
  className?: string
  color?: string
  duration?: number
}

export function TouchRipple({
  children,
  className,
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 0.6,
}: TouchRippleProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const nextId = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const y = e.touches[0].clientY - rect.top
    
    const newRipple = { id: nextId.current++, x, y }
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, duration * 1000)
  }

  return (
    <div
      className={cn('relative overflow-hidden touch-manipulation', className)}
      onTouchStart={handleTouchStart}
    >
      {children}
      
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// Enhanced mobile navigation with gestures
export function MobileGestureNav({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
}: {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
}) {
  return (
    <SwipeableCard
      className={cn('w-full', className)}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      threshold={50}
    >
      {children}
    </SwipeableCard>
  )
}