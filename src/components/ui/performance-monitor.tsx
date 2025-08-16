'use client'
import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Monitor Core Web Vitals (simplified)
    try {
      import('web-vitals').then((webVitals) => {
        if (webVitals.onCLS) webVitals.onCLS(console.log)
        if (webVitals.onFCP) webVitals.onFCP(console.log)
        if (webVitals.onLCP) webVitals.onLCP(console.log)
      }).catch(() => {
        // Silently fail if web-vitals is not available
      })
    } catch (error) {
      // Ignore errors
    }

    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            console.log('Navigation Performance:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              totalTime: navEntry.loadEventEnd - navEntry.fetchStart,
            })
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      
      return () => observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}