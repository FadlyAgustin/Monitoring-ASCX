import { Users, Plane } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../pages/auth/AuthContext'
import { UserRole } from '../../pages/auth/UserRole'

/* ================= ROLE GROUP ================= */

const leaderRoles: UserRole[] = [
  UserRole.ASSISTANT_MANAGER_ASCX,
  UserRole.SUPERVISOR_ASCX,
]

const dashboardRoles: UserRole[] = [
  UserRole.STAFF_ASCX,
  UserRole.STAFF_IT,
]

const staffRoles: UserRole[] = [
  UserRole.STAFF_ASCX,
  UserRole.STAFF_IT,
  UserRole.SUPERVISOR_ASCX,
]

const allRoles: UserRole[] = [
  ...leaderRoles,
  ...staffRoles,
]

/* ================= MENU CONFIG ================= */

const menus: {
  to: string
  label: string
  icon: ReactNode
  roles: UserRole[]
}[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    roles: dashboardRoles,
  },
  {
    to: '/leader',
    label: 'Dashboard',
    icon: '👔',
    roles: leaderRoles,
  },
  {
    to: '/daily-task',
    label: 'Daily Task',
    icon: '📝',
    roles: staffRoles,
  },
  {
    to: '/task-request-logs',
    label: 'Request History',
    icon: '📜',
    roles: allRoles, // semua boleh
  },
  {
    to: '/log-delete',
    label: 'Task Delete',
    icon: '🗑️',
    roles: leaderRoles,
  },
  {
    to: '/summary',
    label: 'Summary',
    icon: '📅',
    roles: allRoles, // semua boleh
  },
  {
    to: '/user-management',
    label: 'User Management',
    icon: <Users className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition" />,
    roles: leaderRoles,
  },
  {
    to: '/job-type',
    label: 'Job Type',
    icon: '⚙️',
    roles: leaderRoles,
  },
]

/* ================= COMPONENT ================= */

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth()
  
  if (!user) return null

  const linkClass = ({ isActive }: { isActive: boolean }) =>
  `
    flex items-center gap-3 px-4 py-3 rounded-lg transition

    ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-medium dark:bg-white/10 dark:text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
    }
  `

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-30"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40
          w-64 min-h-screen
          text-gray-900 dark:text-white
          shadow-xl
          transform transition-transform duration-300

          bg-white
          border-r border-gray-200

          dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900
          dark:border-transparent

          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="px-4 py-6 flex flex-col items-center justify-center relative">

          {/* Glow line separator */}
          <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Logo */}
          <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-pulse">
            <Plane className="h-6 w-6 text-white rotate-45" />
          </div>

          {/* Title */}
          <h2 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white text-center">
            ASCX 
          </h2>

          {/* Subtitle */}
          <p className="text-[11px] text-gray-500 dark:text-slate-400 text-center">
            Monitoring System
          </p>

        </div>

        <nav className="px-3 py-6 space-y-1 text-sm text-gray-700 dark:text-slate-300">
          {menus
            .filter(menu => menu.roles.includes(user.role))
            .map(menu => (
              <NavLink
                key={menu.to}
                to={menu.to}
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-lg">{menu.icon}</span>
                <span>{menu.label}</span>
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  )
}
