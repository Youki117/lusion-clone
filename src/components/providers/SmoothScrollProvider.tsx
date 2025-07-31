'use client'

import { useEffect, useRef, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Context for smooth scroll functionality
interface SmoothScrollContextType {
  scrollToTop: () => void
  scrollToElement: (target: string | HTMLElement, offset?: number) => void
  lenis: Lenis | null
}

const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined)

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    } as any)

    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Cleanup function
    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  // Reset scroll position on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
      ScrollTrigger.refresh()
    }
  }, [pathname])

  // Scroll to top function
  const scrollToTop = () => {
    lenisRef.current?.scrollTo(0, { duration: 2 })
  }

  // Scroll to element function
  const scrollToElement = (target: string | HTMLElement, offset = 0) => {
    lenisRef.current?.scrollTo(target, { offset, duration: 1.5 })
  }

  const contextValue: SmoothScrollContextType = {
    scrollToTop,
    scrollToElement,
    lenis: lenisRef.current,
  }

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      <div>
        {children}
      </div>
    </SmoothScrollContext.Provider>
  )
}

// Hook to use smooth scroll functionality
export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext)

  if (context === undefined) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider')
  }

  return context
}
