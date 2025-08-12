
'use client'

import { useState, useEffect, useRef } from 'react'

export function AnimatedPlaceholder({ placeholders, className }: { placeholders: string[], className?: string }) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0])
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const typingSpeed = 100
  const deletingSpeed = 50
  const delay = 2000

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isDeleting) {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex(charIndex - 1)
        }, deletingSpeed)
      } else {
        setIsDeleting(false)
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
      }
    } else {
      if (charIndex < placeholders[placeholderIndex].length) {
        timer = setTimeout(() => {
          setCharIndex(charIndex + 1)
        }, typingSpeed)
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, delay)
      }
    }

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, placeholderIndex, placeholders, deletingSpeed, typingSpeed, delay])

  useEffect(() => {
    setCurrentPlaceholder(placeholders[placeholderIndex].substring(0, charIndex))
  }, [charIndex, placeholderIndex, placeholders])

  return (
    <span className={className}>
      {currentPlaceholder}
      <span className="animate-pulse">|</span>
    </span>
  )
}
