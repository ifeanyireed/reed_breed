"use client"

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface User {
  id: number
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: any) => Promise<void>
  registerUser: (data: any) => Promise<void>
  logout: () => Promise<void>
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

const AuthProviderInternal = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rb_token')
    }
    return null
  }

  useEffect(() => {
    const checkUser = async () => {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          localStorage.removeItem('rb_token')
        }
      } catch (err) {
        console.error('Auth check failed', err)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  const login = async (credentials: any) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('rb_token', data.token)
      setUser(data.user)
      const redirectTo = searchParams.get('redirect') || (data.user.role === 'admin' ? '/admin' : '/dashboard')
      router.push(redirectTo)
    } else {
      throw new Error(data.message || 'Login failed')
    }
  }

  const registerUser = async (credentials: any) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('rb_token', data.token)
      setUser(data.user)
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      router.push(redirectTo)
    } else {
      throw new Error(data.message || 'Registration failed')
    }
  }

  const logout = async () => {
    const token = getToken()
    if (token) {
      await fetch(`${API_URL}/logout`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
    }
    localStorage.removeItem('rb_token')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <AuthProviderInternal>
      {children}
    </AuthProviderInternal>
  </Suspense>
)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
