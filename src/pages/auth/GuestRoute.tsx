import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { UserRole } from './UserRole'

export default function GuestRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Outlet />
  }

  if (user) {
    if (
      user.role === UserRole.SUPERVISOR_ASCX ||
      user.role === UserRole.ASSISTANT_MANAGER_ASCX
    ) {
      return <Navigate to="/leader" replace />
    }

    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}