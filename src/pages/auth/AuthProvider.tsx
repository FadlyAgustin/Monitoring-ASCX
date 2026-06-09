import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthUser } from './AuthContext'
import { api } from '../../services/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const res = await api.get('/me')
        setUser(res.data)
      } catch {
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {}

    localStorage.removeItem('token')
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
   <AuthContext.Provider value={{ user, setUser, loading, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
