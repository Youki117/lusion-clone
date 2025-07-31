'use client'

import { useEffect, useState } from 'react'
import { LoadingScreen } from './LoadingScreen'

interface LoadingWrapperProps {
  children: React.ReactNode
}

export function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [simulatedProgress, setSimulatedProgress] = useState(0)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('LoadingWrapper mounted')
    console.log('showLoadingScreen:', showLoadingScreen)
    console.log('simulatedProgress:', simulatedProgress)
  }, [showLoadingScreen, simulatedProgress])

  // Simulate loading progress for better UX
  useEffect(() => {
    if (hasLoaded) return

    console.log('Starting progress simulation...')

    // Reset progress to 0 first
    setSimulatedProgress(0)

    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        const increment = prev < 20 ? 3 : prev < 50 ? 4 : prev < 80 ? 3 : prev < 95 ? 2 : 1
        const newProgress = Math.min(prev + increment, 100)
        console.log('Progress:', newProgress)

        if (newProgress >= 100) {
          clearInterval(interval)
        }
        return newProgress
      })
    }, 150) // Slightly slower for better visual effect

    return () => clearInterval(interval)
  }, [hasLoaded])

  // Hide loading screen when progress reaches 100%
  useEffect(() => {
    if (simulatedProgress >= 100) {
      console.log('Progress reached 100%, hiding loading screen in 1.5s')
      const timer = setTimeout(() => {
        console.log('Hiding loading screen now')
        setShowLoadingScreen(false)
        setHasLoaded(true)
      }, 1500) // Show 100% for a moment before hiding

      return () => clearTimeout(timer)
    }
  }, [simulatedProgress])

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false)
  }

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen
          progress={simulatedProgress}
          onComplete={handleLoadingComplete}
          isVisible={showLoadingScreen}
        />
      )}
      <div style={{ opacity: showLoadingScreen ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        {children}
      </div>
    </>
  )
}
