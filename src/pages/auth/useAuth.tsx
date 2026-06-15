import { useEffect, useState } from 'react'
import { api } from '../../services/api'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/me')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (e) {
      // ignore error (token mungkin sudah invalid)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      window.location.href = '/login'
    }
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  }
}
