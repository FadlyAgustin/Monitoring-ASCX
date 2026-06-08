import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthUser } from './AuthContext'
import { api } from '../../services/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    api.get('/me')
      .then(res => {
        if (mounted) setUser(res.data)
      })
      .catch(() => {
        localStorage.removeItem('token')
        if (mounted) setUser(null)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {}
    finally {
      localStorage.removeItem('token')
      setUser(null)
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAuthenticated: !!user, }}>
      {children}
    </AuthContext.Provider>
  )
}
