import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { UserRole } from '../auth/UserRole'

type Props = {
  allow?: UserRole[]
}

export default function ProtectedRoute({ allow }: Props) {
  const token = localStorage.getItem('token')
  const { user, loading } = useAuth()

  // belum login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // masih loading user
  if (loading) return null

  // kalau route punya batasan role
  if (allow && user && !allow.includes(user.role)) {
    // redirect sesuai role
    if (
      user.role === UserRole.ASSISTANT_MANAGER_ASCX ||
      user.role === UserRole.SUPERVISOR_ASCX
    ) {
      return <Navigate to="/leader" replace />
    }

    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
