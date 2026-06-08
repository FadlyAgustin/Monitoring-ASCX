import { createContext, useContext } from 'react'
import { UserRole } from './UserRole'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
