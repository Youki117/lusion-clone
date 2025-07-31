'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, LearningProgress, UserStatistics } from '@/types'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  progress: LearningProgress | null
  setProgress: (progress: LearningProgress | null) => void
  statistics: UserStatistics | null
  setStatistics: (statistics: UserStatistics | null) => void
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: React.ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<LearningProgress | null>(null)
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lusion-user')
    const savedProgress = localStorage.getItem('lusion-progress')
    const savedStatistics = localStorage.getItem('lusion-statistics')

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
      }
    }

    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress)
        setProgress(progressData)
      } catch (error) {
        console.error('Failed to parse saved progress data:', error)
      }
    }

    if (savedStatistics) {
      try {
        const statisticsData = JSON.parse(savedStatistics)
        setStatistics(statisticsData)
      } catch (error) {
        console.error('Failed to parse saved statistics data:', error)
      }
    }
  }, [])

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('lusion-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('lusion-user')
    }
  }, [user])

  useEffect(() => {
    if (progress) {
      localStorage.setItem('lusion-progress', JSON.stringify(progress))
    } else {
      localStorage.removeItem('lusion-progress')
    }
  }, [progress])

  useEffect(() => {
    if (statistics) {
      localStorage.setItem('lusion-statistics', JSON.stringify(statistics))
    } else {
      localStorage.removeItem('lusion-statistics')
    }
  }, [statistics])

  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setProgress(null)
    setStatistics(null)
    setIsAuthenticated(false)
    localStorage.removeItem('lusion-user')
    localStorage.removeItem('lusion-progress')
    localStorage.removeItem('lusion-statistics')
  }

  return (
    <UserContext.Provider 
      value={{ 
        user,
        setUser,
        progress,
        setProgress,
        statistics,
        setStatistics,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
