'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedEntranceProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  stagger?: number
  parallax?: boolean
  scale?: boolean
  opacity?: boolean
}

export function AnimatedEntrance({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 50,
  duration = 0.6,
  stagger = 0.1,
  parallax = false,
  scale = false,
  opacity = true,
}: AnimatedEntranceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], parallax ? [0, -100] : [0, 0])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  const getDirectionalVariants = () => {
    const baseVariants = {
      hidden: {
        opacity: opacity ? 0 : 1,
        scale: scale ? 0.8 : 1,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    }

    switch (direction) {
      case 'up':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: distance },
          visible: { ...baseVariants.visible, y: 0 },
        }
      case 'down':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: -distance },
          visible: { ...baseVariants.visible, y: 0 },
        }
      case 'left':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: distance },
          visible: { ...baseVariants.visible, x: 0 },
        }
      case 'right':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: -distance },
          visible: { ...baseVariants.visible, x: 0 },
        }
      default:
        return baseVariants
    }
  }

  return (
    <motion.div
      ref={ref}
      className={cn('will-change-transform', className)}
      variants={getDirectionalVariants()}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={parallax ? { y } : {}}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredContainer({
  children,
  className,
  stagger = 0.1,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredItem({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 30,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}) {
  const getVariants = () => {
    const base = { opacity: 0, scale: 0.95 }
    const visible = { opacity: 1, scale: 1 }

    switch (direction) {
      case 'up':
        return {
          hidden: { ...base, y: distance },
          visible: { ...visible, y: 0 },
        }
      case 'down':
        return {
          hidden: { ...base, y: -distance },
          visible: { ...visible, y: 0 },
        }
      case 'left':
        return {
          hidden: { ...base, x: distance },
          visible: { ...visible, x: 0 },
        }
      case 'right':
        return {
          hidden: { ...base, x: -distance },
          visible: { ...visible, x: 0 },
        }
      default:
        return { hidden: base, visible }
    }
  }

  return (
    <motion.div
      className={className}
      variants={getVariants()}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}