"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { type AuthState, getCurrentUser, getCachedUser, login as authLogin, logout as authLogout } from "@/lib/auth"

const AuthContext = createContext<{
  authState: AuthState
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const initAuth = async () => {
      console.log('initAuth - starting...')
      
      // First try to get cached user
      const cachedUser = getCachedUser()
      console.log('initAuth - cached user:', cachedUser ? 'found' : 'not found')
      
      if (cachedUser) {
        console.log('initAuth - setting cached user as authenticated')
        setAuthState({
          user: cachedUser,
          isLoading: false,
          isAuthenticated: true,
        })
        
        // Then refresh user data from API
        try {
          console.log('initAuth - refreshing user from API...')
          const refreshedUser = await getCurrentUser()
          if (refreshedUser) {
            console.log('initAuth - user refreshed successfully')
            setAuthState({
              user: refreshedUser,
              isLoading: false,
              isAuthenticated: true,
            })
          } else {
            console.log('initAuth - token invalid, clearing state')
            // Token invalid, clear state
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            })
          }
        } catch (error) {
          console.error('Failed to refresh user:', error)
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } else {
        console.log('initAuth - no cached user, setting unauthenticated')
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('login - starting login process...')
    setAuthState((prev: AuthState) => ({ ...prev, isLoading: true }))
    
    try {
      const user = await authLogin(email, password)
      console.log('login - authLogin result:', user ? 'success' : 'failed')
      
      if (user) {
        console.log('login - setting user as authenticated:', user)
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        })
        return true
      }
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: false }))
      return false
    } catch (error) {
      console.error('Login failed:', error)
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const logout = () => {
    authLogout()
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const refreshUser = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        setAuthState((prev: AuthState) => ({
          ...prev,
          user,
          isAuthenticated: true,
        }))
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }

  return <AuthContext.Provider value={{ authState, login, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
