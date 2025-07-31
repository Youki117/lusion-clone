'use client'

import React, { createContext, useContext, useState } from 'react'

interface TransitionContextType {
  isTransitioning: boolean
  setIsTransitioning: (transitioning: boolean) => void
  transitionType: string
  setTransitionType: (type: string) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export const useTransition = () => {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
}

interface TransitionProviderProps {
  children: React.ReactNode
}

export const TransitionProvider: React.FC<TransitionProviderProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionType, setTransitionType] = useState('fade')

  return (
    <TransitionContext.Provider 
      value={{ 
        isTransitioning, 
        setIsTransitioning, 
        transitionType, 
        setTransitionType 
      }}
    >
      {children}
    </TransitionContext.Provider>
  )
}
